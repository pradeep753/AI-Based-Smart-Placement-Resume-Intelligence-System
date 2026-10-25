const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/tests", require("./routes/testRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ msg: "Internal server error." });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
