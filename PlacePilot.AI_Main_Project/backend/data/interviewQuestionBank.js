const INTERVIEW_TRACKS = [
    {
        key: "hr",
        label: "HR Interview",
        description: "Behavioral and situational interview questions.",
        defaultCount: 5,
    },
    {
        key: "technical",
        label: "Technical Interview",
        description: "Core technical and backend/system understanding questions.",
        defaultCount: 5,
    },
    {
        key: "behavioral",
        label: "Behavioral Interview",
        description: "Ownership, teamwork and communication scenarios.",
        defaultCount: 5,
    },
];

const INTERVIEW_QUESTION_BANK = {
    hr: [
        {
            id: "hr-int-1",
            question: "Tell me about yourself and why you want this role.",
            focusAreas: ["clarity", "motivation", "role fit"],
        },
        {
            id: "hr-int-2",
            question: "Describe a conflict in a team and how you handled it.",
            focusAreas: ["conflict resolution", "teamwork", "communication"],
        },
        {
            id: "hr-int-3",
            question: "What are your top strengths and one weakness?",
            focusAreas: ["self awareness", "growth mindset"],
        },
        {
            id: "hr-int-4",
            question: "How do you prioritize when multiple deadlines overlap?",
            focusAreas: ["time management", "planning", "ownership"],
        },
        {
            id: "hr-int-5",
            question: "Why should we hire you over other candidates?",
            focusAreas: ["impact", "confidence", "value proposition"],
        },
        {
            id: "hr-int-6",
            question: "How do you respond to critical feedback from seniors?",
            focusAreas: ["coachability", "professionalism", "adaptability"],
        },
        {
            id: "hr-int-7",
            question: "Where do you see yourself in the next two years?",
            focusAreas: ["career goals", "learning plan", "commitment"],
        },
        {
            id: "hr-int-8",
            question: "Describe a time you worked under pressure.",
            focusAreas: ["pressure handling", "prioritization", "composure"],
        },
        {
            id: "hr-int-9",
            question: "What motivates you to keep improving your skills?",
            focusAreas: ["motivation", "self learning", "consistency"],
        },
        {
            id: "hr-int-10",
            question: "How do you handle a task when the instructions are unclear?",
            focusAreas: ["clarification", "initiative", "communication"],
        },
        {
            id: "hr-int-11",
            question: "Tell me about a project you are proud of.",
            focusAreas: ["project clarity", "ownership", "impact"],
        },
        {
            id: "hr-int-12",
            question: "How do you manage time during exam or placement preparation?",
            focusAreas: ["time management", "discipline", "planning"],
        },
    ],
    technical: [
        {
            id: "tech-int-1",
            question: "Explain the difference between authentication and authorization.",
            focusAreas: ["security basics", "clear explanation"],
        },
        {
            id: "tech-int-2",
            question: "How would you design a scalable resume upload API?",
            focusAreas: ["api design", "scalability", "file handling"],
        },
        {
            id: "tech-int-3",
            question: "What are indexes in databases and why are they important?",
            focusAreas: ["db performance", "query optimization"],
        },
        {
            id: "tech-int-4",
            question: "How do you secure JWT-based APIs in production?",
            focusAreas: ["jwt security", "token handling", "best practices"],
        },
        {
            id: "tech-int-5",
            question: "When would you choose SQL over NoSQL for a project?",
            focusAreas: ["data modeling", "tradeoff analysis"],
        },
        {
            id: "tech-int-6",
            question: "How do you debug a slow endpoint in Node.js?",
            focusAreas: ["profiling", "debugging process", "performance tuning"],
        },
        {
            id: "tech-int-7",
            question: "Explain how middleware works in an Express.js application.",
            focusAreas: ["express", "middleware", "request response flow"],
        },
        {
            id: "tech-int-8",
            question: "What steps would you take to validate and store uploaded files securely?",
            focusAreas: ["file validation", "security", "storage"],
        },
        {
            id: "tech-int-9",
            question: "How would you structure MongoDB collections for users, resumes, and interview attempts?",
            focusAreas: ["mongodb", "schema design", "relationships"],
        },
        {
            id: "tech-int-10",
            question: "What is the difference between synchronous and asynchronous code in JavaScript?",
            focusAreas: ["javascript", "async", "event loop"],
        },
        {
            id: "tech-int-11",
            question: "How do you handle errors consistently in a REST API?",
            focusAreas: ["error handling", "status codes", "api design"],
        },
        {
            id: "tech-int-12",
            question: "Explain how password hashing improves authentication security.",
            focusAreas: ["bcrypt", "hashing", "authentication security"],
        },
    ],
    behavioral: [
        {
            id: "beh-int-1",
            question: "Describe a time you took ownership without being asked.",
            focusAreas: ["ownership", "initiative", "impact"],
        },
        {
            id: "beh-int-2",
            question: "Tell me about a failure and what you learned from it.",
            focusAreas: ["resilience", "learning mindset", "reflection"],
        },
        {
            id: "beh-int-3",
            question: "How do you ensure effective communication in remote teams?",
            focusAreas: ["communication", "collaboration", "clarity"],
        },
        {
            id: "beh-int-4",
            question: "Describe a situation where requirements changed mid-project.",
            focusAreas: ["adaptability", "planning", "stakeholder handling"],
        },
        {
            id: "beh-int-5",
            question: "How do you handle pressure during placement season?",
            focusAreas: ["stress management", "discipline", "consistency"],
        },
        {
            id: "beh-int-6",
            question: "Give an example of mentoring or helping a peer improve.",
            focusAreas: ["leadership", "empathy", "team impact"],
        },
        {
            id: "beh-int-7",
            question: "Describe a time you received negative feedback and improved from it.",
            focusAreas: ["feedback", "growth mindset", "improvement"],
        },
        {
            id: "beh-int-8",
            question: "Tell me about a time you had to learn a new tool quickly.",
            focusAreas: ["learning ability", "adaptability", "execution"],
        },
        {
            id: "beh-int-9",
            question: "Describe a situation where you disagreed with a teammate.",
            focusAreas: ["disagreement", "respectful communication", "resolution"],
        },
        {
            id: "beh-int-10",
            question: "How do you stay consistent when progress is slow?",
            focusAreas: ["consistency", "motivation", "discipline"],
        },
        {
            id: "beh-int-11",
            question: "Tell me about a time you made a mistake and corrected it.",
            focusAreas: ["accountability", "problem solving", "learning"],
        },
        {
            id: "beh-int-12",
            question: "Describe a time you helped your team meet a difficult deadline.",
            focusAreas: ["teamwork", "deadline", "support"],
        },
    ],
};

const TRACK_KEYS = Object.keys(INTERVIEW_QUESTION_BANK);

const shuffle = (items) => {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const sanitizeQuestion = (question) => ({
    id: question.id,
    question: question.question,
    focusAreas: question.focusAreas,
});

const getInterviewTrackCatalog = () => INTERVIEW_TRACKS.map((track) => ({
    ...track,
    questionCount: (INTERVIEW_QUESTION_BANK[track.key] || []).length,
}));

const getInterviewQuestions = (track, count) => {
    if (!INTERVIEW_QUESTION_BANK[track]) return [];
    const trackMeta = INTERVIEW_TRACKS.find((item) => item.key === track);
    const safeCount = Math.max(1, Math.min(10, Number(count) || (trackMeta && trackMeta.defaultCount) || 5));
    return shuffle(INTERVIEW_QUESTION_BANK[track]).slice(0, safeCount).map(sanitizeQuestion);
};

const getInterviewQuestionById = (track, questionId) => {
    const bucket = INTERVIEW_QUESTION_BANK[track] || [];
    return bucket.find((item) => item.id === questionId) || null;
};

const getInterviewQuestionByIdAnyTrack = (questionId) => {
    for (const key of TRACK_KEYS) {
        const question = INTERVIEW_QUESTION_BANK[key].find((item) => item.id === questionId);
        if (question) return question;
    }
    return null;
};

module.exports = {
    getInterviewTrackCatalog,
    getInterviewQuestions,
    getInterviewQuestionById,
    getInterviewQuestionByIdAnyTrack,
};
