import express from "express";
import Message from "../models/message.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get conversation between logged-in user and another user
router.get("/:id", protectRoute, async (req, res) => {
    try {
        const myId = req.user._id;
        const otherId = req.params.id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: otherId },
                { senderId: otherId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Send a message
router.post("/send/:id", protectRoute, async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id;

        const newMessage = new Message({ senderId, receiverId, text, image });
        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;