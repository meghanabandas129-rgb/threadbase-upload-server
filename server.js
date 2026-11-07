import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "threadbase_secret";

app.use(cors());
app.use(express.json());

// Serve uploaded images publicly
app.use("/uploads", express.static("uploads"));

// Demo account
const users = [
  {
    userId: 1,
    username: "ada",
    password: "password",
  },
];

// Login - generates JWT token
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      userId: user.userId,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  res.json({
    token,
    user: {
      userId: user.userId,
      username: user.username,
    },
  });
});

// File upload route
app.use("/api", uploadRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "threadbase-upload-server",
  });
});

// Handle Multer errors and rejected file types
app.use((err, req, res, next) => {
  if (err instanceof Error) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File size must not exceed 5 MB",
      });
    }

    if (err.message === "Only image files are allowed") {
      return res.status(400).json({
        error: err.message,
      });
    }
  }

  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});