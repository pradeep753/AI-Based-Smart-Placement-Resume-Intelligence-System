const ASSESSMENT_CATALOG = [
    {
        key: "aptitude",
        label: "Aptitude Test",
        description: "Quantitative aptitude and logical reasoning.",
        defaultCount: 5,
    },
    {
        key: "technical",
        label: "Technical Test",
        description: "Computer science fundamentals and web/backend concepts.",
        defaultCount: 5,
    },
    {
        key: "coding",
        label: "Coding Round",
        description: "Problem solving, time complexity and coding decisions.",
        defaultCount: 5,
    },
    {
        key: "hr",
        label: "HR Test",
        description: "Behavioral, communication and situational judgement.",
        defaultCount: 5,
    },
    {
        key: "mock",
        label: "Mock Test",
        description: "Mixed placement simulation from all sections.",
        defaultCount: 8,
    },
];

const QUESTION_BANK = {
    aptitude: [
        {
            id: "apt-1",
            topic: "Percentages",
            question: "A value increases from 80 to 100. What is the percentage increase?",
            options: ["20%", "25%", "30%", "40%"],
            answerIndex: 1,
            explanation: "Increase is 20 on base 80, so 20/80 = 25%.",
        },
        {
            id: "apt-2",
            topic: "Time and Work",
            question: "A can finish work in 12 days, B in 18 days. Together they finish in:",
            options: ["6 days", "7.2 days", "8 days", "9 days"],
            answerIndex: 1,
            explanation: "Rate = 1/12 + 1/18 = 5/36, time = 36/5 = 7.2 days.",
        },
        {
            id: "apt-3",
            topic: "Profit and Loss",
            question: "An item bought for Rs 500 is sold for Rs 575. Profit percentage is:",
            options: ["10%", "12%", "15%", "18%"],
            answerIndex: 2,
            explanation: "Profit is 75. 75/500 = 15%.",
        },
        {
            id: "apt-4",
            topic: "Number Series",
            question: "Find next number: 3, 6, 12, 24, ?",
            options: ["30", "36", "42", "48"],
            answerIndex: 3,
            explanation: "Each term doubles. 24 x 2 = 48.",
        },
        {
            id: "apt-5",
            topic: "Probability",
            question: "Probability of getting an even number on one fair die roll is:",
            options: ["1/6", "1/3", "1/2", "2/3"],
            answerIndex: 2,
            explanation: "Even outcomes are 2,4,6 => 3 out of 6 => 1/2.",
        },
        {
            id: "apt-6",
            topic: "Simple Interest",
            question: "Simple interest on Rs 10,000 at 8% per year for 2 years is:",
            options: ["Rs 800", "Rs 1200", "Rs 1600", "Rs 2000"],
            answerIndex: 2,
            explanation: "SI = PRT/100 = 10000*8*2/100 = 1600.",
        },
        {
            id: "apt-7",
            topic: "Ratio",
            question: "If ratio of boys:girls is 3:2 and total is 50, number of girls is:",
            options: ["20", "25", "30", "35"],
            answerIndex: 0,
            explanation: "Total parts=5, each=10, girls=2*10=20.",
        },
    ],
    technical: [
        {
            id: "tech-1",
            topic: "DBMS",
            question: "Which SQL command is used to remove a table and its data?",
            options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"],
            answerIndex: 2,
            explanation: "DROP removes the table definition and data.",
        },
        {
            id: "tech-2",
            topic: "Operating Systems",
            question: "Which scheduling algorithm can cause starvation?",
            options: ["Round Robin", "FCFS", "Priority Scheduling", "SJF Preemptive"],
            answerIndex: 2,
            explanation: "Low-priority tasks may starve in priority scheduling.",
        },
        {
            id: "tech-3",
            topic: "Networking",
            question: "HTTP status code for unauthorized access is:",
            options: ["200", "301", "401", "500"],
            answerIndex: 2,
            explanation: "401 stands for Unauthorized.",
        },
        {
            id: "tech-4",
            topic: "JavaScript",
            question: "Which method converts JSON string to JavaScript object?",
            options: ["JSON.toObject()", "JSON.parse()", "JSON.convert()", "JSON.stringify()"],
            answerIndex: 1,
            explanation: "JSON.parse converts string to object.",
        },
        {
            id: "tech-5",
            topic: "Backend",
            question: "In REST API design, which method is generally idempotent?",
            options: ["POST", "PUT", "PATCH", "CONNECT"],
            answerIndex: 1,
            explanation: "PUT is expected to be idempotent.",
        },
        {
            id: "tech-6",
            topic: "Data Structures",
            question: "Which data structure follows FIFO order?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            answerIndex: 1,
            explanation: "Queue follows FIFO.",
        },
        {
            id: "tech-7",
            topic: "Git",
            question: "Which command creates a new branch and switches to it?",
            options: ["git branch -m", "git checkout -b", "git reset --hard", "git clone -b"],
            answerIndex: 1,
            explanation: "git checkout -b creates and switches.",
        },
    ],
    coding: [
        {
            id: "code-1",
            topic: "Time Complexity",
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
            answerIndex: 1,
            explanation: "Binary search halves search space each step.",
        },
        {
            id: "code-2",
            topic: "Arrays",
            question: "Which approach is best to find duplicates in large integer array quickly?",
            options: ["Nested loops", "Hash set", "Bubble sort", "Linked list scan"],
            answerIndex: 1,
            explanation: "Hash set provides near O(n) detection.",
        },
        {
            id: "code-3",
            topic: "Recursion",
            question: "Recursion should usually have:",
            options: ["Only one loop", "Global variables", "Base condition", "No return statement"],
            answerIndex: 2,
            explanation: "Base condition stops infinite recursion.",
        },
        {
            id: "code-4",
            topic: "Dynamic Programming",
            question: "DP is mainly used to optimize problems with:",
            options: ["Randomized states", "Overlapping subproblems", "No recurrence", "Constant input size"],
            answerIndex: 1,
            explanation: "DP stores solutions of overlapping subproblems.",
        },
        {
            id: "code-5",
            topic: "Sorting",
            question: "Which sort is stable by default in many JavaScript engines for arrays?",
            options: ["Quick sort", "Heap sort", "Merge sort based implementation", "Selection sort"],
            answerIndex: 2,
            explanation: "Modern JS engines generally ensure stable sort behavior.",
        },
        {
            id: "code-6",
            topic: "Strings",
            question: "Best structure to check if prefixes exist efficiently is:",
            options: ["Stack", "Trie", "Queue", "Heap"],
            answerIndex: 1,
            explanation: "Trie is specialized for prefix operations.",
        },
        {
            id: "code-7",
            topic: "Graphs",
            question: "Which algorithm is commonly used for shortest path with non-negative weights?",
            options: ["Prim", "Kruskal", "Dijkstra", "DFS"],
            answerIndex: 2,
            explanation: "Dijkstra is used for non-negative weighted shortest path.",
        },
    ],
    hr: [
        {
            id: "hr-1",
            topic: "Communication",
            question: "Best response when you do not know an interview answer is:",
            options: [
                "Guess confidently with unrelated points",
                "Admit honestly and share how you would find the answer",
                "Stay silent",
                "Change topic immediately",
            ],
            answerIndex: 1,
            explanation: "Honesty and problem-solving approach is valued.",
        },
        {
            id: "hr-2",
            topic: "Teamwork",
            question: "In a team conflict, first step should generally be:",
            options: ["Escalate immediately", "Ignore it", "Understand both sides and discuss calmly", "Quit the task"],
            answerIndex: 2,
            explanation: "Constructive communication resolves most conflicts.",
        },
        {
            id: "hr-3",
            topic: "Ownership",
            question: "A strong ownership statement in interview is:",
            options: [
                "I only do what I am told",
                "I avoid risky work",
                "I take responsibility for outcomes and communicate early",
                "I prefer individual work only",
            ],
            answerIndex: 2,
            explanation: "Ownership includes responsibility and communication.",
        },
        {
            id: "hr-4",
            topic: "Behavior",
            question: "When receiving critical feedback, best approach is:",
            options: ["Defend immediately", "Ignore feedback", "Listen, clarify, and create action plan", "Blame others"],
            answerIndex: 2,
            explanation: "Growth mindset is highly valued.",
        },
        {
            id: "hr-5",
            topic: "Time Management",
            question: "When deadlines overlap, the right strategy is:",
            options: ["Work randomly", "Communicate priorities and break work into milestones", "Delay all tasks", "Pick easiest task only"],
            answerIndex: 1,
            explanation: "Prioritization with transparent communication works best.",
        },
        {
            id: "hr-6",
            topic: "Professionalism",
            question: "In interview, STAR method is mainly used for:",
            options: ["Technical code optimization", "Behavioral answers", "Company valuation", "Salary negotiation"],
            answerIndex: 1,
            explanation: "STAR helps structure behavioral examples.",
        },
        {
            id: "hr-7",
            topic: "Adaptability",
            question: "Good way to describe adaptability is:",
            options: [
                "I dislike changes",
                "I wait for others to solve uncertainty",
                "I learn quickly and adjust plans with new constraints",
                "I avoid new tools",
            ],
            answerIndex: 2,
            explanation: "Adaptability means learning and adjusting effectively.",
        },
    ],
};

const CATEGORY_KEYS = Object.keys(QUESTION_BANK);

const shuffle = (items) => {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const sanitizeQuestion = ({ answerIndex, ...rest }) => rest;

const getQuestionById = (questionId) => {
    for (const category of CATEGORY_KEYS) {
        const question = QUESTION_BANK[category].find((item) => item.id === questionId);
        if (question) return question;
    }
    return null;
};

const getCategoryMeta = () => ASSESSMENT_CATALOG.map((item) => ({
    ...item,
    questionCount: item.key === "mock"
        ? CATEGORY_KEYS.reduce((total, key) => total + QUESTION_BANK[key].length, 0)
        : (QUESTION_BANK[item.key] || []).length,
}));

const getQuestionsForCategory = (category, count) => {
    const safeCount = Math.max(1, Math.min(20, Number(count) || 5));

    if (category === "mock") {
        const questions = [];
        const perSection = Math.max(1, Math.floor(safeCount / CATEGORY_KEYS.length));

        CATEGORY_KEYS.forEach((key) => {
            questions.push(...shuffle(QUESTION_BANK[key]).slice(0, perSection));
        });

        if (questions.length < safeCount) {
            const remainingPool = shuffle(CATEGORY_KEYS.flatMap((key) => QUESTION_BANK[key]));
            for (const item of remainingPool) {
                if (questions.length >= safeCount) break;
                if (!questions.find((question) => question.id === item.id)) {
                    questions.push(item);
                }
            }
        }

        return shuffle(questions).slice(0, safeCount).map(sanitizeQuestion);
    }

    if (!QUESTION_BANK[category]) return [];
    return shuffle(QUESTION_BANK[category]).slice(0, safeCount).map(sanitizeQuestion);
};

const buildRecommendations = (weakTopics) => {
    if (!weakTopics.length) {
        return [
            "Great work. Maintain consistency with at least one mixed mock test per day.",
            "Move to higher-difficulty questions to improve placement readiness.",
        ];
    }

    return weakTopics.slice(0, 3).map((topic) => `Revise ${topic} concepts and solve 10 practice questions today.`);
};

const evaluateAssessment = ({ category, answers }) => {
    const normalizedAnswers = Array.isArray(answers) ? answers : [];
    let correctAnswers = 0;
    const details = [];
    const weakTopicSet = new Set();

    normalizedAnswers.forEach((answer) => {
        const question = getQuestionById(answer.questionId);
        if (!question) return;

        const selectedIndex = Number(answer.selectedIndex);
        const isCorrect = selectedIndex === question.answerIndex;
        if (isCorrect) correctAnswers += 1;
        if (!isCorrect && question.topic) weakTopicSet.add(question.topic);

        details.push({
            questionId: question.id,
            topic: question.topic,
            selectedIndex,
            correctIndex: question.answerIndex,
            isCorrect,
            explanation: question.explanation,
        });
    });

    const totalQuestions = details.length;
    const score = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const weakTopics = [...weakTopicSet];

    return {
        category,
        totalQuestions,
        correctAnswers,
        wrongAnswers: Math.max(0, totalQuestions - correctAnswers),
        score,
        weakTopics,
        recommendations: buildRecommendations(weakTopics),
        details,
    };
};

module.exports = {
    getCategoryMeta,
    getQuestionsForCategory,
    evaluateAssessment,
};
