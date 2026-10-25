const Resume = require("../models/Resume");
const { analyzeResume } = require("../utils/aiService.js");
const { isDatabaseConnected } = require("../config/db");
const store = require("../data/inMemoryStore");
const { extractResumeText } = require("../utils/resumeParser");
const { recommendJobsFromSkills } = require("../utils/resumeInsights");

const extractScore = (feedback) => {
    const matches = String(feedback || "").match(/(?:score[^0-9]*|^|\s)(\d{1,3})(?:\s*\/\s*100)?/i);
    if (!matches) return 0;

    const raw = Number(matches[1]);
    if (!Number.isFinite(raw)) return 0;

    return Math.max(0, Math.min(100, raw));
};

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "Please upload a resume file." });
        }

        const extractedText = await extractResumeText(req.file);
        if (!extractedText || extractedText.length < 20) {
            return res.status(400).json({
                msg: "Could not extract enough content from resume. Please upload a clear text-based PDF.",
            });
        }

        const analysis = await analyzeResume(extractedText);
        const improvements = Array.isArray(analysis.improvements) ? analysis.improvements : [];
        const skills = Array.isArray(analysis.skills) ? analysis.skills : [];
        const summary = String(analysis.summary || "Resume analyzed successfully.");
        const score = Number.isFinite(analysis.score)
            ? Math.max(0, Math.min(100, Math.round(analysis.score)))
            : extractScore(summary);

        const jobMatches = recommendJobsFromSkills(skills, 5);
        const feedback = [
            `Score: ${score}/100`,
            summary,
            "Improvements:",
            ...improvements.map((item, index) => `${index + 1}. ${item}`),
        ].join("\n");

        const resumePayload = {
            userId: req.user.id,
            fileUrl: `/uploads/${req.file.filename}`,
            feedback,
            score,
            summary,
            extractedText: extractedText.slice(0, 10000),
            skills,
            improvements,
            jobMatches,
        };

        const resume = isDatabaseConnected()
            ? await Resume.create(resumePayload)
            : store.createResume(resumePayload);

        return res.status(201).json({
            resume,
            analysis: {
                score,
                summary,
                improvements,
                skills,
                jobMatches,
            },
        });
    } catch (error) {
        console.error(error);

        if (String(error.message || "").toLowerCase().includes("pdf")) {
            return res.status(400).json({ msg: "Could not parse PDF. Please upload a valid text-based PDF resume." });
        }

        return res.status(500).json({ msg: "Unable to upload resume right now." });
    }
};

exports.getMyResumes = async (req, res) => {
    try {
        const resumes = isDatabaseConnected()
            ? await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 })
            : store.listResumesByUserId(req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.json({ resumes });
    } catch (error) {
        return res.status(500).json({ msg: "Unable to fetch resumes." });
    }
};
