import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
    User,
    Mail,
    Shield,
    Heart,
    Bookmark,
    LogOut,
    ArrowRight
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

import "./Profile.css";

function Profile() {

    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (

        <MainLayout>

            <div className="profile-page">

                <div className="profile-card">

                    <div className="profile-header">

                        <div className="profile-avatar">
                            <User size={32} />
                        </div>

                        <h1 className="profile-title">
                            My Profile
                        </h1>

                        <p className="profile-subtitle">
                            Manage your MovieFlick account
                        </p>

                    </div>

                    <div className="profile-info">

                        <div className="profile-info-item">

                            <div className="profile-info-icon">
                                <User size={19} />
                            </div>

                            <div className="profile-info-content">

                                <span className="profile-info-label">
                                    Full Name
                                </span>

                                <span className="profile-info-value">
                                    {user?.full_name || "Not available"}
                                </span>

                            </div>

                        </div>

                        <div className="profile-info-item">

                            <div className="profile-info-icon">
                                <Mail size={19} />
                            </div>

                            <div className="profile-info-content">

                                <span className="profile-info-label">
                                    Email Address
                                </span>

                                <span className="profile-info-value">
                                    {user?.email || "Not available"}
                                </span>

                            </div>

                        </div>

                        <div className="profile-info-item">

                            <div className="profile-info-icon">
                                <Shield size={19} />
                            </div>

                            <div className="profile-info-content">

                                <span className="profile-info-label">
                                    Account Role
                                </span>

                                <span className="profile-info-value profile-role">
                                    {user?.role || "User"}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="profile-section-divider" />

                    <div className="profile-library">

                        <h2 className="profile-library-title">
                            My Library
                        </h2>

                        <div className="profile-library-options">

                            <Link
                                to="/favorites"
                                className="profile-library-card"
                            >

                                <div className="profile-library-icon favorites-icon">
                                    <Heart size={21} />
                                </div>

                                <div className="profile-library-content">

                                    <span className="profile-library-name">
                                        My Favorites
                                    </span>

                                    <span className="profile-library-description">
                                        View your favorite movies
                                    </span>

                                </div>

                                <ArrowRight
                                    className="profile-library-arrow"
                                    size={19}
                                />

                            </Link>

                            <Link
                                to="/watchlist"
                                className="profile-library-card"
                            >

                                <div className="profile-library-icon watchlist-icon">
                                    <Bookmark size={21} />
                                </div>

                                <div className="profile-library-content">

                                    <span className="profile-library-name">
                                        My Watchlist
                                    </span>

                                    <span className="profile-library-description">
                                        View movies you want to watch
                                    </span>

                                </div>

                                <ArrowRight
                                    className="profile-library-arrow"
                                    size={19}
                                />

                            </Link>

                        </div>

                    </div>

                    <div className="profile-section-divider" />

                    <div className="profile-actions">

                        <button
                            type="button"
                            className="profile-logout-button"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>

                    </div>

                </div>

            </div>

        </MainLayout>

    );
}

export default Profile;