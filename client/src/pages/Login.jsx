import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    LogIn,
    ArrowRight
} from "lucide-react";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );

            login(
                response.data.user,
                response.data.token
            );

            alert(response.data.message);

            navigate("/");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login failed."
            );

        }

    };

    return (
        <MainLayout>

            <div className="login-page">

                <div className="login-header">

                    <div className="login-icon">
                        <LogIn size={26} />
                    </div>

                    <h1 className="login-title">
                        Welcome Back
                    </h1>

                    <p className="login-subtitle">
                        Login to continue to MovieFlick
                    </p>

                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="login-input-group">

                        <label htmlFor="login-email">
                            Email Address
                        </label>

                        <div className="login-input-wrapper">

                            <Mail
                                className="login-input-icon"
                                size={19}
                            />

                            <input
                                id="login-email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="login-input-group">

                        <label htmlFor="login-password">
                            Password
                        </label>

                        <div className="login-input-wrapper">

                            <LockKeyhole
                                className="login-input-icon"
                                size={19}
                            />

                            <input
                                id="login-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
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

                    <button
                        type="submit"
                        className="login-submit-button"
                    >
                        <span>Login</span>
                        <ArrowRight size={19} />
                    </button>

                </form>

                <div className="login-divider">
                    <span>OR</span>
                </div>

                <p className="login-register-text">
                    Don't have an account?
                    <Link to="/register">
                        Register now
                    </Link>
                </p>

                <Link
                    to="/forgot-password"
                    className="login-forgot-link"
                >
                    Forgot password?
                </Link>

            </div>

        </MainLayout>
    );
}

export default Login;