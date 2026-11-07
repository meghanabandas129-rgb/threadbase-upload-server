import express from "express";
import upload from "../config/upload.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("avatar"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const url = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      url,
      filename: req.file.filename,
    });
  }
);

export default router;
