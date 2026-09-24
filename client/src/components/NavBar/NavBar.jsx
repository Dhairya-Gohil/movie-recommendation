import "./NavBar.css";

import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Heart, Bookmark } from "lucide-react";

function Navbar() {

    const { user, logout } = useAuth();

    return (

        <nav className="navbar">

            <Link to="/">

                <div className="logo">

                    🎬 MovieAI

                </div>

            </Link>

            <div className="nav-right">

                {

                    user ? (

                        <>

                            <span>

                                Welcome, {user.full_name}

                            </span>

                            <Link to="/profile">

                                Profile

                            </Link>

                            <Link to="/favorites">

                                <Heart size={16} strokeWidth={2.5} /> Favorites

                            </Link>

                            <Link to="/watchlist">

                                <Bookmark size={16} strokeWidth={2.5} /> Watchlist

                            </Link>

                            <button
                                className="logout-btn"
                                onClick={() => {

                                    logout();

                                    window.location.href = "/login";

                                }}
                            >

                                Logout

                            </button>

                        </>

                    ) : (

                        <>

                            <Link to="/login">

                                Login

                            </Link>

                            <Link to="/register">

                                Register

                            </Link>

                        </>

                    )

                }

            </div>

        </nav>

    );

}

export default Navbar;