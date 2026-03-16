import express from "express";
import { login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Session check – called by AuthContext on every page load
router.get("/check", protectRoute, (req, res) => {
    res.status(200).json({ user: req.user });
});

router.put("/update-profile", protectRoute, updateProfile);

export default router;