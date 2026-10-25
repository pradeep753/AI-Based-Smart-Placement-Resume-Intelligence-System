const TestAttempt = require("../models/TestAttempt");
const { isDatabaseConnected } = require("../config/db");
const store = require("../data/inMemoryStore");
const {
    getCategoryMeta,
    getQuestionsForCategory,
    evaluateAssessment,
} = require("../data/questionBank");

const SORT_RECENT_FIRST = (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const buildSummary = (attempts) => {
    const byCategory = {};

    attempts.forEach((attempt) => {
        const key = attempt.category;
        if (!byCategory[key]) {
            byCategory[key] = {
                category: key,
                attempts: 0,
                averageScore: 0,
                latestScore: 0,
            };
        }

        byCategory[key].attempts += 1;
        byCategory[key].averageScore += attempt.score;

        if (byCategory[key].attempts === 1) {
            byCategory[key].latestScore = attempt.score;
        }
    });

    const categoryStats = Object.values(byCategory).map((item) => ({
        ...item,
        averageScore: item.attempts ? Math.round(item.averageScore / item.attempts) : 0,
    }));

    const overallScore = categoryStats.length
        ? Math.round(categoryStats.reduce((sum, item) => sum + item.averageScore, 0) / categoryStats.length)
        : 0;

    return {
        overallScore,
        categoryStats,
        totalAttempts: attempts.length,
    };
};

exports.getAssessments = async (req, res) => {
    return res.json({ assessments: getCategoryMeta() });
};

exports.startAssessment = async (req, res) => {
    const category = String(req.params.category || "").toLowerCase();
    const count = Number(req.query.count);
    const questions = getQuestionsForCategory(category, count);

    if (!questions.length) {
        return res.status(404).json({ msg: "Assessment not found." });
    }

    return res.json({
        category,
        totalQuestions: questions.length,
        questions,
    });
};

exports.submitAssessment = async (req, res) => {
    try {
        const category = String(req.body.category || "").toLowerCase();
        const answers = Array.isArray(req.body.answers) ? req.body.answers : [];

        if (!category) {
            return res.status(400).json({ msg: "Assessment category is required." });
        }

        if (!answers.length) {
            return res.status(400).json({ msg: "Provide at least one answer." });
        }

        const evaluation = evaluateAssessment({ category, answers });

        if (!evaluation.totalQuestions) {
            return res.status(400).json({ msg: "Could not evaluate answers. Invalid question payload." });
        }

        const attemptPayload = {
            userId: req.user.id,
            ...evaluation,
        };

        const attempt = isDatabaseConnected()
            ? await TestAttempt.create(attemptPayload)
            : store.createTestAttempt(attemptPayload);

        return res.status(201).json({ attempt });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Unable to submit assessment." });
    }
};

exports.getAssessmentHistory = async (req, res) => {
    try {
        const attempts = isDatabaseConnected()
            ? await TestAttempt.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(30)
            : store.listTestAttemptsByUserId(req.user.id).sort(SORT_RECENT_FIRST).slice(0, 30);

        return res.json({ attempts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Unable to fetch assessment history." });
    }
};

exports.getAssessmentSummary = async (req, res) => {
    try {
        const attempts = isDatabaseConnected()
            ? await TestAttempt.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100)
            : store.listTestAttemptsByUserId(req.user.id).sort(SORT_RECENT_FIRST).slice(0, 100);

        const summary = buildSummary(attempts);
        return res.json({ summary });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Unable to fetch assessment summary." });
    }
};
