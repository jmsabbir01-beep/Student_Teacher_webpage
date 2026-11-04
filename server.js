// server.js
// StudyVault - Secure Study Resource Sharing and Management System
// Entry point: sets up Express, middleware, routes, and static frontend.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

require("./config/db"); // ensures DB + tables exist on startup

const authRoutes = require("./routes/auth");
const resourceRoutes = require("./routes/resources");
const bookmarkRoutes = require("./routes/bookmarks");
const adminRoutes = require("./routes/admin");
const notificationRoutes = require("./routes/notifications");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "StudyVault API" }));

app.use("/api", (req, res) => res.status(404).json({ error: "API route not found." }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`StudyVault server running at http://localhost:${PORT}`);
});
