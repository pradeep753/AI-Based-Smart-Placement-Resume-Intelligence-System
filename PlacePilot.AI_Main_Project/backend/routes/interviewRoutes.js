const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
    getInterviewCatalog,
    startInterview,
    submitInterview,
    getInterviewHistory,
} = require("../controllers/interviewController");

const router = express.Router();

router.get("/catalog", auth, getInterviewCatalog);
router.get("/start/:track", auth, startInterview);
router.post("/submit", auth, submitInterview);
router.get("/history", auth, getInterviewHistory);

module.exports = router;
