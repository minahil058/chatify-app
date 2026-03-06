import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("messages endpoint");
});

export default router;