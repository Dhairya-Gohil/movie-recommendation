import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const { user, logout } = useAuth();

    return (

        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 30px",
                borderBottom: "1px solid #ccc"
            }}
        >

            <Link to="/">
                <h2>Movie Recommendation</h2>
            </Link>

            <div>

                {
                    user ? (

                        <>

                            <span>
                                Welcome, {user.full_name}
                            </span>

                            {" "}

                            <Link to="/profile">
                                Profile
                            </Link>

                            {" "}

                            <button
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

                            {" | "}

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