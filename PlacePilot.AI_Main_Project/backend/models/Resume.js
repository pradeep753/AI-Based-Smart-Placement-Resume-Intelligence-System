const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.Mixed, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    score: { type: Number, min: 0, max: 100, default: 0 },
    feedback: { type: String, default: "No feedback generated." },
    summary: { type: String, default: "" },
    extractedText: { type: String, default: "" },
    skills: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    jobMatches: {
        type: [{
            title: String,
            description: String,
            matchScore: Number,
            matchedSkills: [String],
            missingSkills: [String],
        }],
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
