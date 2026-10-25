const SKILL_KEYWORDS = [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node.js",
    "express",
    "mongodb",
    "mysql",
    "postgresql",
    "python",
    "java",
    "c++",
    "c#",
    "html",
    "css",
    "tailwind",
    "redux",
    "aws",
    "docker",
    "kubernetes",
    "git",
    "rest api",
    "graphql",
    "dsa",
    "oop",
    "sql",
    "machine learning",
    "tensorflow",
    "pandas",
    "power bi",
];

const JOB_CATALOG = [
    {
        title: "Frontend Developer",
        requiredSkills: ["javascript", "react", "html", "css", "typescript"],
        description: "Build responsive user interfaces and collaborate with design teams.",
    },
    {
        title: "Backend Developer",
        requiredSkills: ["node.js", "express", "mongodb", "sql", "rest api"],
        description: "Design APIs, data models and scalable backend services.",
    },
    {
        title: "Full Stack Developer",
        requiredSkills: ["javascript", "react", "node.js", "express", "mongodb", "git"],
        description: "Own end-to-end features across frontend and backend.",
    },
    {
        title: "Software Development Engineer",
        requiredSkills: ["dsa", "oop", "java", "python", "git"],
        description: "Solve complex engineering problems and build production software.",
    },
    {
        title: "Data Analyst",
        requiredSkills: ["sql", "python", "pandas", "power bi"],
        description: "Analyze data and create business insights dashboards.",
    },
    {
        title: "Machine Learning Engineer",
        requiredSkills: ["python", "machine learning", "tensorflow", "sql"],
        description: "Train and deploy ML models into production workflows.",
    },
];

const unique = (values) => [...new Set(values)];

const normalizeSkill = (skill) => String(skill || "").trim().toLowerCase();

const extractSkillsFromText = (text) => {
    const source = String(text || "").toLowerCase();
    if (!source) return [];

    const skills = SKILL_KEYWORDS.filter((keyword) => {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const matcher = new RegExp(`\\b${escaped}\\b`, "i");
        return matcher.test(source);
    });

    return unique(skills);
};

const recommendJobsFromSkills = (skills, limit = 5) => {
    const normalizedSkills = unique((skills || []).map(normalizeSkill).filter(Boolean));

    const matches = JOB_CATALOG.map((job) => {
        const required = job.requiredSkills.map(normalizeSkill);
        const matchedSkills = required.filter((skill) => normalizedSkills.includes(skill));
        const matchScore = required.length ? Math.round((matchedSkills.length / required.length) * 100) : 0;

        return {
            title: job.title,
            description: job.description,
            matchScore,
            matchedSkills,
            missingSkills: required.filter((skill) => !matchedSkills.includes(skill)),
        };
    })
        .filter((job) => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, Math.max(1, limit));

    if (matches.length) return matches;

    return [
        {
            title: "General Software Trainee",
            description: "Start with broad placement roles and strengthen technical fundamentals.",
            matchScore: 35,
            matchedSkills: normalizedSkills.slice(0, 3),
            missingSkills: ["javascript", "sql", "oop"],
        },
    ];
};

module.exports = {
    extractSkillsFromText,
    recommendJobsFromSkills,
};
