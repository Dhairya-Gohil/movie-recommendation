import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Mail,
    KeyRound,
    ArrowRight,
    ArrowLeft
} from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

import "./ForgotPassword.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {

            const response = await api.post(
                "/auth/forgot-password",
                {
                    email
                }
            );

            setMessage(response.data.message);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to process your request."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <MainLayout>

            <div className="forgot-password-page">

                <div className="forgot-password-header">

                    <div className="forgot-password-icon">
                        <KeyRound size={26} />
                    </div>

                    <h1 className="forgot-password-title">
                        Forgot Password?
                    </h1>

                    <p className="forgot-password-subtitle">
                        Enter your email and we'll send you a
                        password reset link.
                    </p>

                </div>

                {message && (
                    <div className="forgot-password-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="forgot-password-error">
                        {error}
                    </div>
                )}

                <form
                    className="forgot-password-form"
                    onSubmit={handleSubmit}
                >

                    <div className="forgot-password-input-group">

                        <label htmlFor="forgot-password-email">
                            Email Address
                        </label>

                        <div className="forgot-password-input-wrapper">

                            <Mail
                                className="forgot-password-input-icon"
                                size={19}
                            />

                            <input
                                id="forgot-password-email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="forgot-password-submit-button"
                        disabled={loading}
                    >

                        <span>
                            {loading
                                ? "Sending..."
                                : "Send Reset Link"}
                        </span>

                        {!loading && (
                            <ArrowRight size={19} />
                        )}

                    </button>

                </form>

                <div className="forgot-password-divider">
                    <span>OR</span>
                </div>

                <Link
                    to="/login"
                    className="forgot-password-back-link"
                >
                    <ArrowLeft size={17} />
                    <span>Back to Login</span>
                </Link>

            </div>

        </MainLayout>
    );
}

export default ForgotPassword;