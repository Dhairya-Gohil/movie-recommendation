import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import MovieDetails from "./pages/MovieDetails";
import Favourites from "./pages/Favourites";
import Watchlist from "./pages/Watchlist";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  console.log("CURRENT APP JSX LOADED");

  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/movies/:id"
        element={<MovieDetails />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;