const express = require("express");

const router = express.Router();

const {
    register,
    login,
    getProfile,
    logout,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const authenticate = require("../middleware/authMiddleware");

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authenticate, getProfile);

router.post("/logout", logout);

/* password reset */

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;