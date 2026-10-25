const crypto = require("crypto");

const users = [];
const resumes = [];
const testAttempts = [];
const interviewAttempts = [];

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const createUser = ({ name, email, password }) => {
    const user = {
        id: crypto.randomUUID(),
        name: String(name || "").trim(),
        email: normalizeEmail(email),
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    users.push(user);
    return user;
};

const findUserByEmail = (email) => users.find((user) => user.email === normalizeEmail(email));
const findUserById = (id) => users.find((user) => user.id === id);

const updateUser = (id, updates) => {
    const user = findUserById(id);

    if (!user) return null;

    if (typeof updates.name === "string" && updates.name.trim()) {
        user.name = updates.name.trim();
    }

    if (typeof updates.email === "string" && updates.email.trim()) {
        user.email = normalizeEmail(updates.email);
    }

    user.updatedAt = new Date();
    return user;
};

const createResume = (payload) => {
    const resume = {
        id: crypto.randomUUID(),
        userId: payload.userId,
        fileUrl: payload.fileUrl,
        score: Number.isFinite(payload.score) ? payload.score : 0,
        feedback: String(payload.feedback || ""),
        summary: String(payload.summary || ""),
        extractedText: String(payload.extractedText || ""),
        skills: Array.isArray(payload.skills) ? payload.skills : [],
        improvements: Array.isArray(payload.improvements) ? payload.improvements : [],
        jobMatches: Array.isArray(payload.jobMatches) ? payload.jobMatches : [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    resumes.push(resume);
    return resume;
};

const listResumesByUserId = (userId) => resumes.filter((resume) => resume.userId === userId);

const createTestAttempt = (payload) => {
    const attempt = {
        id: crypto.randomUUID(),
        userId: payload.userId,
        category: payload.category,
        score: Number.isFinite(payload.score) ? payload.score : 0,
        totalQuestions: Number(payload.totalQuestions) || 0,
        correctAnswers: Number(payload.correctAnswers) || 0,
        wrongAnswers: Number(payload.wrongAnswers) || 0,
        weakTopics: Array.isArray(payload.weakTopics) ? payload.weakTopics : [],
        recommendations: Array.isArray(payload.recommendations) ? payload.recommendations : [],
        details: Array.isArray(payload.details) ? payload.details : [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    testAttempts.push(attempt);
    return attempt;
};

const listTestAttemptsByUserId = (userId) => testAttempts.filter((attempt) => attempt.userId === userId);

const createInterviewAttempt = (payload) => {
    const attempt = {
        id: crypto.randomUUID(),
        userId: payload.userId,
        track: payload.track,
        overallScore: Number(payload.overallScore) || 0,
        overallFeedback: String(payload.overallFeedback || ""),
        strengths: Array.isArray(payload.strengths) ? payload.strengths : [],
        improvements: Array.isArray(payload.improvements) ? payload.improvements : [],
        details: Array.isArray(payload.details) ? payload.details : [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    interviewAttempts.push(attempt);
    return attempt;
};

const listInterviewAttemptsByUserId = (userId) => interviewAttempts.filter((attempt) => attempt.userId === userId);

module.exports = {
    createUser,
    createResume,
    createTestAttempt,
    createInterviewAttempt,
    findUserByEmail,
    findUserById,
    listInterviewAttemptsByUserId,
    listResumesByUserId,
    listTestAttemptsByUserId,
    updateUser,
};
