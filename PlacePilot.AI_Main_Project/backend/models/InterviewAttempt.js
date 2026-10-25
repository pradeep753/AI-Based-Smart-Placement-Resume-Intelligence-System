const mongoose = require("mongoose");

const interviewAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
    track: { type: String, required: true },
    overallScore: { type: Number, min: 0, max: 100, default: 0 },
    overallFeedback: { type: String, default: "" },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    details: {
        type: [{
            questionId: String,
            question: String,
            answerText: String,
            score: Number,
            feedback: String,
            strengths: [String],
            improvements: [String],
        }],
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model("InterviewAttempt", interviewAttemptSchema);
