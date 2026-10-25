const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
    getAssessments,
    startAssessment,
    submitAssessment,
    getAssessmentHistory,
    getAssessmentSummary,
} = require("../controllers/testController");

const router = express.Router();

router.get("/catalog", auth, getAssessments);
router.get("/start/:category", auth, startAssessment);
router.post("/submit", auth, submitAssessment);
router.get("/history", auth, getAssessmentHistory);
router.get("/summary", auth, getAssessmentSummary);

module.exports = router;
