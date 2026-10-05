import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
    LockKeyhole,
    Eye,
    EyeOff,
    CheckCircle,
    ArrowRight,
    ArrowLeft
} from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

import "./ResetPassword.css";

function ResetPassword() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setPasswordError("");

        if (!token) {
            setError(
                "This password reset link is invalid."
            );
            return;
        }

        if (password.length < 6) {
            setPasswordError(
                "Password must be at least 6 characters long."
            );
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError(
                "Passwords do not match."
            );
            return;
        }

        setLoading(true);

        try {

            const response = await api.post(
                "/auth/reset-password",
                {
                    token,
                    password
                }
            );

            setSuccess(true);

            setTimeout(() => {
                navigate("/login");
            }, 2500);

            console.log(response.data.message);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to reset your password."
            );

        } finally {

            setLoading(false);

        }
    };

    if (success) {
        return (
            <MainLayout>

                <div className="reset-password-page">

                    <div className="reset-password-success">

                        <div className="reset-password-success-icon">
                            <CheckCircle size={30} />
                        </div>

                        <h1>
                            Password Reset Successful
                        </h1>

                        <p>
                            Your password has been updated
                            successfully.
                        </p>

                        <p className="reset-password-redirect">
                            Redirecting you to login...
                        </p>

                        <Link
                            to="/login"
                            className="reset-password-login-link"
                        >
                            <span>Go to Login</span>
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                </div>

            </MainLayout>
        );
    }

    return (
        <MainLayout>

            <div className="reset-password-page">

                <div className="reset-password-header">

                    <div className="reset-password-icon">
                        <LockKeyhole size={26} />
                    </div>

                    <h1 className="reset-password-title">
                        Reset Password
                    </h1>

                    <p className="reset-password-subtitle">
                        Create a new password for your
                        MovieFlick account.
                    </p>

                </div>

                {error && (
                    <div className="reset-password-error">
                        {error}
                    </div>
                )}

                <form
                    className="reset-password-form"
                    onSubmit={handleSubmit}
                >

                    <div className="reset-password-input-group">

                        <label htmlFor="reset-password">
                            New Password
                        </label>

                        <div className="reset-password-input-wrapper">

                            <LockKeyhole
                                className="reset-password-input-icon"
                                size={19}
                            />

                            <input
                                id="reset-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your new password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError("");
                                }}
                                required
                            />

                            <button
                                type="button"
                                className="reset-password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                            </button>

                        </div>

                    </div>

                    <div className="reset-password-input-group">

                        <label htmlFor="reset-confirm-password">
                            Confirm New Password
                        </label>

                        <div
                            className={`reset-password-input-wrapper ${passwordError
                                ? "password-mismatch"
                                : ""
                                }`}
                        >

                            <LockKeyhole
                                className="reset-password-input-icon"
                                size={19}
                            />

                            <input
                                id="reset-confirm-password"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Re-enter your new password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(
                                        e.target.value
                                    );
                                    setPasswordError("");
                                }}
                                required
                            />

                            <button
                                type="button"
                                className="reset-password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                            </button>

                        </div>

                        {passwordError && (
                            <p className="reset-password-field-error">
                                {passwordError}
                            </p>
                        )}

                    </div>

                    <button
                        type="submit"
                        className="reset-password-submit-button"
                        disabled={loading}
                    >

                        <span>
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}
                        </span>

                        {!loading && (
                            <ArrowRight size={19} />
                        )}

                    </button>

                </form>

                <div className="reset-password-divider">
                    <span>OR</span>
                </div>

                <Link
                    to="/login"
                    className="reset-password-back-link"
                >
                    <ArrowLeft size={17} />
                    <span>Back to Login</span>
                </Link>

            </div>

        </MainLayout>
    );
}

export default ResetPassword;