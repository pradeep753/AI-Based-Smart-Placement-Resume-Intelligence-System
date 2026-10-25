const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
    category: { type: String, required: true },
    score: { type: Number, min: 0, max: 100, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    weakTopics: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    details: {
        type: [{
            questionId: String,
            topic: String,
            selectedIndex: Number,
            correctIndex: Number,
            isCorrect: Boolean,
            explanation: String,
        }],
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model("TestAttempt", testAttemptSchema);
