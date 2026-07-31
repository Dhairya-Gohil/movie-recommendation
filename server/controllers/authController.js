const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateTokens");

const {

    findUserByEmail,
    createUser,
    findUserById

} = require("../models/userModel");

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

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

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

        const existingUser = await findUserByEmail(email);

        if (existingUser) {

            return res.status(409).json({

                success: false,
                message: "Email already exists."

            });

        }

        const password_hash = await bcrypt.hash(password, 10);

        const userId = await createUser({

            full_name,
            email,
            password_hash

        });

        return res.status(201).json({

            success: true,

            message: "User registered successfully.",

            user_id: userId

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

}

module.exports = {

    register, login, getProfile, logout

};