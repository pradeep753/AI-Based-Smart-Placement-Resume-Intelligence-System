const InterviewAttempt = require("../models/InterviewAttempt");
const { isDatabaseConnected } = require("../config/db");
const store = require("../data/inMemoryStore");
const {
    getInterviewTrackCatalog,
    getInterviewQuestions,
    getInterviewQuestionById,
    getInterviewQuestionByIdAnyTrack,
} = require("../data/interviewQuestionBank");
const { evaluateInterviewAnswers } = require("../utils/interviewService");

const SORT_RECENT_FIRST = (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

exports.getInterviewCatalog = async (req, res) => {
    return res.json({ tracks: getInterviewTrackCatalog() });
};

exports.startInterview = async (req, res) => {
    const track = String(req.params.track || "").toLowerCase();
    const count = Number(req.query.count);
    const questions = getInterviewQuestions(track, count);

    if (!questions.length) {
        return res.status(404).json({ msg: "Interview track not found." });
    }

    return res.json({
        track,
        totalQuestions: questions.length,
        questions,
    });
};

exports.submitInterview = async (req, res) => {
    try {
        const track = String(req.body.track || "").toLowerCase();
        const answers = Array.isArray(req.body.answers) ? req.body.answers : [];

        if (!track) {
            return res.status(400).json({ msg: "Track is required." });
        }

        if (!answers.length) {
            return res.status(400).json({ msg: "At least one interview answer is required." });
        }

        const responses = [];

        for (const row of answers) {
            const questionId = String(row.questionId || "").trim();
            const answerText = String(row.answerText || "").trim();

            if (!questionId || !answerText) continue;

            const questionObj = getInterviewQuestionById(track, questionId) || getInterviewQuestionByIdAnyTrack(questionId);
            if (!questionObj) continue;

            responses.push({
                questionId,
                question: questionObj.question,
                focusAreas: questionObj.focusAreas || [],
                answerText,
            });
        }

        if (!responses.length) {
            return res.status(400).json({ msg: "Could not match interview questions for submitted answers." });
        }

        const evaluation = await evaluateInterviewAnswers({ track, responses });

        const attemptPayload = {
            userId: req.user.id,
            track,
            overallScore: evaluation.overallScore,
            overallFeedback: evaluation.overallFeedback,
            strengths: evaluation.strengths,
            improvements: evaluation.improvements,
            details: evaluation.details,
        };

        const attempt = isDatabaseConnected()
            ? await InterviewAttempt.create(attemptPayload)
            : store.createInterviewAttempt(attemptPayload);

        return res.status(201).json({ attempt });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Unable to submit interview answers right now." });
    }
};

exports.getInterviewHistory = async (req, res) => {
    try {
        const attempts = isDatabaseConnected()
            ? await InterviewAttempt.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20)
            : store.listInterviewAttemptsByUserId(req.user.id).sort(SORT_RECENT_FIRST).slice(0, 20);

        return res.json({ attempts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Unable to fetch interview history." });
    }
};
