const { generateGeminiText, isGeminiConfigured, parseJsonFromGeminiText } = require("./geminiClient");

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
const unique = (values) => [...new Set(values.filter(Boolean))];

const keywordSet = [
    "impact",
    "result",
    "improved",
    "optimized",
    "collaborated",
    "designed",
    "implemented",
    "tested",
    "debugged",
    "measured",
    "stakeholder",
    "deadline",
    "ownership",
    "team",
];

const stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "do",
    "for",
    "from",
    "how",
    "i",
    "in",
    "is",
    "it",
    "me",
    "my",
    "of",
    "on",
    "or",
    "the",
    "this",
    "to",
    "what",
    "when",
    "where",
    "why",
    "with",
    "would",
    "you",
    "your",
]);

const fillerAnswers = new Set([
    "no",
    "none",
    "nothing",
    "n/a",
    "na",
    "idk",
    "i dont know",
    "i don't know",
    "dont know",
    "don't know",
    "test",
    "asdf",
    "qwerty",
    "abc",
    "xyz",
]);

const normalizeAnswerText = (text) => String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (text) => normalizeAnswerText(text)
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !stopWords.has(word));

const hasMostlyRepeatedContent = (answer) => {
    const compact = answer.replace(/\s+/g, "");
    if (!compact) return true;

    if (/(.)\1{5,}/.test(compact)) return true;

    const words = answer.split(/\s+/).filter(Boolean);
    if (words.length < 4) return false;

    const uniqueWords = new Set(words);
    return uniqueWords.size <= 2 && words.length >= 5;
};

const hasEnoughReadableWords = (answer) => {
    const words = answer.split(/\s+/).filter(Boolean);
    const readableWords = words.filter((word) => /[aeiou]/.test(word) && word.length >= 2);
    return readableWords.length >= 4;
};

const isInvalidAnswer = (answerText) => {
    const answer = normalizeAnswerText(answerText);
    if (!answer) return true;
    if (fillerAnswers.has(answer)) return true;
    if (answer.length < 25) return true;
    if (hasMostlyRepeatedContent(answer)) return true;
    if (!hasEnoughReadableWords(answer)) return true;

    return false;
};

const getRelevanceTerms = ({ question, focusAreas }) => {
    const source = `${question || ""} ${(focusAreas || []).join(" ")}`;
    return unique(tokenize(source)).slice(0, 12);
};

const hasRelevantContent = (item) => {
    const terms = getRelevanceTerms(item);
    if (!terms.length) return true;

    const answer = normalizeAnswerText(item.answerText);
    const matches = terms.filter((term) => answer.includes(term));
    return matches.length >= 1;
};

const buildInvalidAnswerResult = ({ questionId, question, answerText }) => ({
    questionId,
    question,
    answerText: String(answerText || "").trim(),
    score: 0,
    feedback: `The answer for "${question}" is invalid or not meaningful enough to evaluate.`,
    strengths: [],
    improvements: [
        "Write a relevant answer that directly addresses the question.",
        "Use a clear example with Situation, Task, Action and Result.",
        "Avoid random text, repeated words, or placeholder responses.",
    ],
});

const buildUnrelatedAnswerResult = ({ questionId, question, answerText }) => ({
    questionId,
    question,
    answerText: String(answerText || "").trim(),
    score: 0,
    feedback: `The answer for "${question}" does not address the question, so it cannot receive marks.`,
    strengths: [],
    improvements: [
        "Answer the exact question asked instead of writing a generic response.",
        "Mention details related to the question topic or focus area.",
        "Use a specific example with Situation, Task, Action and Result.",
    ],
});

const evaluateSingleFallback = ({ questionId, question, focusAreas, answerText }) => {
    const answer = String(answerText || "").trim();
    const item = { questionId, question, focusAreas, answerText: answer };

    if (isInvalidAnswer(answer)) {
        return buildInvalidAnswerResult(item);
    }

    if (!hasRelevantContent(item)) {
        return buildUnrelatedAnswerResult(item);
    }

    const wordCount = answer.split(/\s+/).filter(Boolean).length;
    const lowercase = answer.toLowerCase();

    let score = 30;
    if (wordCount >= 20) score += 20;
    if (wordCount >= 45) score += 20;
    if (wordCount >= 80) score += 10;

    const keywordMatches = keywordSet.filter((word) => lowercase.includes(word)).length;
    score += Math.min(20, keywordMatches * 3);

    const strengths = [];
    const improvements = [];

    if (wordCount >= 45) {
        strengths.push("Answer has good depth and context.");
    } else {
        improvements.push("Add more detail using specific examples.");
    }

    if (keywordMatches >= 3) {
        strengths.push("Includes action-oriented language and ownership cues.");
    } else {
        improvements.push("Use stronger action verbs and measurable outcomes.");
    }

    if (!/[0-9]/.test(answer)) {
        improvements.push("Include numbers or metrics to show impact.");
    } else {
        strengths.push("Contains measurable impact indicators.");
    }

    if (answer.length < 40) {
        improvements.push("Answer is too short for interview standards.");
    }

    if (!strengths.length) strengths.push("Clear attempt to answer the question.");
    if (!improvements.length) improvements.push("Tighten structure using Situation-Task-Action-Result format.");

    return {
        questionId,
        question,
        answerText: answer,
        score: clampScore(score),
        feedback: `Good attempt. Keep answers concise but impact-oriented for "${question}".`,
        strengths: unique(strengths).slice(0, 3),
        improvements: unique(improvements).slice(0, 3),
    };
};

const fallbackInterviewEvaluation = (responses) => {
    const details = responses.map(evaluateSingleFallback);
    const overallScore = details.length
        ? clampScore(details.reduce((sum, item) => sum + item.score, 0) / details.length)
        : 0;
    const hasInvalidAnswers = details.some((item) => item.score === 0);

    const strengths = unique(details.flatMap((item) => item.strengths)).slice(0, 5);
    const improvements = unique(details.flatMap((item) => item.improvements)).slice(0, 5);

    return {
        overallScore,
        overallFeedback: hasInvalidAnswers
            ? "Some answers were invalid or not meaningful enough to evaluate. Rewrite them with relevant examples."
            : "Interview responses evaluated with structured rubric fallback.",
        strengths,
        improvements,
        details,
    };
};

const normalizeAiResult = (responses, parsed) => {
    const mappedById = new Map();
    if (parsed && Array.isArray(parsed.perQuestion)) {
        parsed.perQuestion.forEach((entry) => {
            if (entry && entry.questionId) mappedById.set(entry.questionId, entry);
        });
    }

    const details = responses.map((item) => {
        if (isInvalidAnswer(item.answerText)) {
            return buildInvalidAnswerResult(item);
        }

        if (!hasRelevantContent(item)) {
            return buildUnrelatedAnswerResult(item);
        }

        const aiEntry = mappedById.get(item.questionId) || {};

        return {
            questionId: item.questionId,
            question: item.question,
            answerText: item.answerText,
            score: clampScore(aiEntry.score),
            feedback: String(aiEntry.feedback || `Answer evaluated for "${item.question}".`),
            strengths: Array.isArray(aiEntry.strengths) ? aiEntry.strengths.slice(0, 3) : [],
            improvements: Array.isArray(aiEntry.improvements) ? aiEntry.improvements.slice(0, 3) : [],
        };
    });

    const scoreFromDetails = details.length
        ? clampScore(details.reduce((sum, row) => sum + row.score, 0) / details.length)
        : 0;

    return {
        overallScore: clampScore(parsed && parsed.overallScore ? parsed.overallScore : scoreFromDetails),
        overallFeedback: details.some((item) => item.score === 0)
            ? "Some answers were invalid or not meaningful enough to evaluate. Rewrite them with relevant examples."
            : String((parsed && parsed.overallFeedback) || "Interview responses analyzed successfully."),
        strengths: unique(
            Array.isArray(parsed && parsed.strengths)
                ? parsed.strengths
                : details.flatMap((item) => item.strengths)
        ).slice(0, 5),
        improvements: unique(
            Array.isArray(parsed && parsed.improvements)
                ? parsed.improvements
                : details.flatMap((item) => item.improvements)
        ).slice(0, 5),
        details,
    };
};

const evaluateWithGemini = async (track, responses) => {
    const prompt = [
        "You are an expert interview evaluator for placement preparation.",
        "If an answer is random text, repeated words, filler, too short, unrelated to the question, or not meaningful, score it 0.",
        "Be strict: a fluent answer that does not address the specific question or focus areas must receive 0.",
        "A good answer must be relevant, specific, structured, and include concrete actions or results.",
        "For invalid answers, feedback must clearly say the answer is invalid or unrelated and tell the user to write a relevant structured response.",
        "Return ONLY valid JSON with this exact shape:",
        "{",
        '  "overallScore": number (0-100),',
        '  "overallFeedback": string,',
        '  "strengths": string[],',
        '  "improvements": string[],',
        '  "perQuestion": [',
        "    {",
        '      "questionId": string,',
        '      "score": number (0-100),',
        '      "feedback": string,',
        '      "strengths": string[],',
        '      "improvements": string[]',
        "    }",
        "  ]",
        "}",
        `Interview track: ${track}`,
        "Question-answer pairs:",
        JSON.stringify(responses),
    ].join("\n");

    const outputText = await generateGeminiText(prompt);
    const parsed = parseJsonFromGeminiText(outputText);
    if (!parsed) return null;

    return normalizeAiResult(responses, parsed);
};

const evaluateInterviewAnswers = async ({ track, responses }) => {
    if (!Array.isArray(responses) || !responses.length) {
        return {
            overallScore: 0,
            overallFeedback: "No responses provided.",
            strengths: [],
            improvements: ["Provide answers to interview questions."],
            details: [],
        };
    }

    if (!isGeminiConfigured()) {
        return fallbackInterviewEvaluation(responses);
    }

    try {
        const aiEvaluation = await evaluateWithGemini(track, responses);
        if (aiEvaluation) return aiEvaluation;
    } catch (error) {
        console.error("Interview AI evaluation failed. Falling back to rubric mode.");
        console.error(error.message);
    }

    return fallbackInterviewEvaluation(responses);
};

module.exports = {
    evaluateInterviewAnswers,
};
