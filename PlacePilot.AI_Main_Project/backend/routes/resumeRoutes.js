const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/authMiddleware");
const { uploadResume, getMyResumes } = require("../controllers/resumeController");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const allowedExtensions = new Set([".pdf", ".doc", ".docx", ".txt"]);

const upload = multer({
    dest: uploadDir,
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname || "").toLowerCase();
        if (!allowedExtensions.has(extension)) {
            return cb(new Error("Only PDF, DOC, DOCX, TXT files are allowed."));
        }

        return cb(null, true);
    },
});

router.post("/upload", auth, upload.single("resume"), uploadResume);
router.get("/my", auth, getMyResumes);

router.use((err, req, res, next) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
        return res.status(400).json({ msg: err.message });
    }

    return res.status(400).json({ msg: err.message || "Invalid resume upload request." });
});

module.exports = router;
