const bcrypt = require("bcrypt");
const crypto = require("crypto");

const generateToken = require("../utils/generateTokens");

const {
    findUserByEmail,
    createUser,
    findUserById,
    updateUserPassword
} = require("../models/userModel");

const {
    createPasswordReset,
    findPasswordResetByToken,
    deletePasswordReset,
    deletePasswordResetsByUser
} = require("../models/passwordResetModel");

const {
    sendPasswordResetEmail
} = require("../services/emailService");

async function login(req, res) {

    console.log(req.body);

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await findUserByEmail(normalizedEmail);

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });

        }

        const isPasswordValid = await bcrypt.compare(
            String(password),
            user.password_hash
        );

        if (!isPasswordValid) {

            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });

        }

        const token = generateToken(user);

        return res.status(200).json({

            success: true,
            message: "Login successful.",

            token,

            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

function logout(req, res) {

    return res.status(200).json({

        success: true,
        message: "Logout successful."

    });

}

async function getProfile(req, res) {

    console.log(req.user);

    try {

        const user = await findUserById(req.user.user_id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        return res.status(200).json({

            success: true,

            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}

async function register(req, res) {

    console.log(req.body);

    try {

        const {
            full_name,
            email,
            password
        } = req.body;

        if (!full_name || !email || !password) {

            return res.status(400).json({

                success: false,
                message: "All fields are required."

            });

        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await findUserByEmail(
            normalizedEmail
        );

        if (existingUser) {

            return res.status(409).json({

                success: false,
                message: "Email already exists."

            });

        }

        const password_hash = await bcrypt.hash(
            password,
            10
        );

        const userId = await createUser({

            full_name,
            email: normalizedEmail,
            password_hash

        });

        return res.status(201).json({

            success: true,

            message: "User registered successfully.",

            user_id: userId

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

}

async function forgotPassword(req, res) {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({

                success: false,
                message: "Email address is required."

            });

        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await findUserByEmail(
            normalizedEmail
        );

        /*
         * Always return the same response whether
         * the email exists or not.
         *
         * This prevents email enumeration.
         */

        if (!user) {

            return res.status(200).json({

                success: true,

                message:
                    "If an account exists with this email, a password reset link has been sent."

            });

        }

        /*
         * Generate a secure random token.
         */

        const resetToken = crypto.randomBytes(32).toString("hex");

        /*
         * Store only the hash of the token.
         */

        const tokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        /*
         * Token expires after 15 minutes.
         */

        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await createPasswordReset(
            user.user_id,
            tokenHash,
            expiresAt
        );

        /*
         * Frontend URL used inside the email.
         */

        const resetLink =
            `http://localhost:5173/reset-password?token=${resetToken}`;

        await sendPasswordResetEmail(
            normalizedEmail,
            resetLink
        );

        return res.status(200).json({

            success: true,

            message:
                "If an account exists with this email, a password reset link has been sent."

        });

    } catch (error) {

        console.error("Forgot password error:", error);

        return res.status(500).json({

            success: false,

            message:
                "Unable to process password reset request."

        });

    }

}

async function resetPassword(req, res) {

    try {

        const {
            token,
            password
        } = req.body;

        if (!token || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Reset token and password are required."

            });

        }

        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters long."

            });

        }

        /*
         * Hash the token received from the frontend.
         */

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        /*
         * Find a valid, non-expired reset token.
         */

        const resetRequest =
            await findPasswordResetByToken(
                tokenHash
            );

        if (!resetRequest) {

            return res.status(400).json({

                success: false,

                message:
                    "This password reset link is invalid or has expired."

            });

        }

        /*
         * Hash the new password.
         */

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        /*
         * Update the user's password.
         */

        await updateUserPassword(
            resetRequest.user_id,
            passwordHash
        );

        /*
         * Delete all reset requests for this user.
         */

        await deletePasswordResetsByUser(
            resetRequest.user_id
        );

        return res.status(200).json({

            success: true,

            message:
                "Password reset successful. You can now login."

        });

    } catch (error) {

        console.error("Reset password error:", error);

        return res.status(500).json({

            success: false,

            message:
                "Unable to reset password."

        });

    }

}

module.exports = {

    register,
    login,
    getProfile,
    logout,
    forgotPassword,
    resetPassword

};