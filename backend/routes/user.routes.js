import express from "express";
import User from "../models/user.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get all users except the logged-in user (for the sidebar contact list)
router.get("/", protectRoute, async (req, res) => {
    try {
        const myId = req.user._id;
        const users = await User.find({ _id: { $ne: myId } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsers:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
