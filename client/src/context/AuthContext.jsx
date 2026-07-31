import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadUser() {

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response = await api.get(
                    "/auth/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(response.data.user);

            } catch (error) {

                console.error("Profile fetch error:", error);

                // Only log out if it's an explicit unauthorized or invalid token error
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }

            } finally {

                setLoading(false);

            }

        }

        loadUser();

    }, [token]);

    function login(userData, jwt) {

        localStorage.setItem("token", jwt);

        setUser(userData);
        setToken(jwt);

    }

    function logout() {

        localStorage.removeItem("token");

        setUser(null);
        setToken(null);

    }

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}