import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    UserPlus,
    ArrowRight
} from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        if (
            name === "password" ||
            name === "confirmPassword"
        ) {
            setPasswordError("");
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {

            setPasswordError(
                "Passwords do not match."
            );

            return;
        }

        setPasswordError("");

        try {

            const response = await api.post(
                "/auth/register",
                {
                    full_name: formData.full_name,
                    email: formData.email,
                    password: formData.password
                }
            );

            alert(response.data.message);

            navigate("/login");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration failed."
            );

        }
    };

    return (
        <MainLayout>

            <div className="register-page">

                <div className="register-header">

                    <div className="register-icon">
                        <UserPlus size={26} />
                    </div>

                    <h1 className="register-title">
                        Create Account
                    </h1>

                    <p className="register-subtitle">
                        Join MovieAI and discover your next movie
                    </p>

                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    {/* Full Name */}

                    <div className="register-input-group">

                        <label htmlFor="register-name">
                            Full Name
                        </label>

                        <div className="register-input-wrapper">

                            <User
                                className="register-input-icon"
                                size={19}
                            />

                            <input
                                id="register-name"
                                type="text"
                                name="full_name"
                                placeholder="Enter your full name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    {/* Email */}

                    <div className="register-input-group">

                        <label htmlFor="register-email">
                            Email Address
                        </label>

                        <div className="register-input-wrapper">

                            <Mail
                                className="register-input-icon"
                                size={19}
                            />

                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    {/* Password */}

                    <div className="register-input-group">

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <div className="register-input-wrapper">

                            <LockKeyhole
                                className="register-input-icon"
                                size={19}
                            />

                            <input
                                id="register-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="register-password-toggle"
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

                    {/* Confirm Password */}

                    <div className="register-input-group">

                        <label htmlFor="register-confirm-password">
                            Confirm Password
                        </label>

                        <div
                            className={`register-input-wrapper ${passwordError
                                    ? "password-mismatch"
                                    : ""
                                }`}
                        >

                            <LockKeyhole
                                className="register-input-icon"
                                size={19}
                            />

                            <input
                                id="register-confirm-password"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="register-password-toggle"
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
                            <p className="password-error">
                                {passwordError}
                            </p>
                        )}

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        className="register-submit-button"
                    >
                        <span>Create Account</span>
                        <ArrowRight size={19} />
                    </button>

                </form>

                <div className="register-divider">
                    <span>OR</span>
                </div>

                <p className="register-login-text">
                    Already have an account?
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </MainLayout>
    );
}

export default Register;