const API_BASE_URL = "http://localhost:5000";
let currentAssessment = null;
let currentInterviewSession = null;

function apiUrl(path) {
    return `${API_BASE_URL}${path}`;
}

function isInsidePagesDirectory() {
    return window.location.pathname.includes("/pages/");
}

function getLoginPagePath() {
    return isInsidePagesDirectory() ? "login.html" : "pages/login.html";
}

function getToken() {
    return localStorage.getItem("token");
}

function authHeaders(includeJson = false) {
    const token = getToken();
    const headers = {};

    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

function fetchOptions(options = {}) {
    return {
        cache: "no-store",
        ...options,
    };
}

function setLoadingButton(button, isLoading, loadingText) {
    if (!button) return;

    if (isLoading) {
        button.dataset.originalText = button.innerText;
        button.innerText = loadingText;
        button.disabled = true;
        return;
    }

    button.innerText = button.dataset.originalText || button.innerText;
    button.disabled = false;
}

function setTheme(theme) {
    document.body.className = theme || "";
    localStorage.setItem("theme", theme || "");
}

function checkLogin() {
    const token = getToken();
    const publicPages = new Set(["index.html", "login.html", "signup.html", "about.html"]);
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    if (!token && !publicPages.has(currentPage)) {
        alert("Unauthorized! Please login.");
        window.location.href = getLoginPagePath();
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.className = savedTheme;
    }
}

window.addEventListener("load", function () {
    checkLogin();
    loadTheme();
    loadProfileData();
    loadUserProfile();
    bindAppearanceThemeOptions();

    if (document.getElementById("resumeScore")) {
        loadLatestResumeInsights();
    }

    if (document.getElementById("overallScoreValue")) {
        loadResultsDashboard();
    }

    if (document.getElementById("assessmentCatalog")) {
        loadAssessmentCatalog();
    }

    if (document.getElementById("interviewCatalog")) {
        loadInterviewCatalog();
        loadLatestInterviewResult();
    }
});

async function loginUser(event) {
    event.preventDefault();

    const email = document.querySelector("input[name='email']").value.trim();
    const password = document.querySelector("input[name='password']").value;

    if (!email || !password) {
        alert("Please fill all fields!");
        return false;
    }

    try {
        const res = await fetch(apiUrl("/api/auth/login"), fetchOptions({
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({ email, password }),
        }));

        const data = await res.json();

        if (!res.ok) {
            alert(data.msg || "Login failed");
            return false;
        }

        localStorage.setItem("token", data.token);

        if (data.user) {
            localStorage.setItem("userName", data.user.name || "");
            localStorage.setItem("userEmail", data.user.email || "");
        }

        alert("Login successful!");
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error(error);
        alert("Server error!");
    }

    return false;
}

async function validateSignup(event) {
    event.preventDefault();

    const name = document.querySelector("input[name='name']").value.trim();
    const email = document.querySelector("input[name='email']").value.trim();
    const password = document.querySelector("input[name='password']").value;
    const confirmPassword = document.querySelector("input[name='confirmPassword']").value;

    if (!name || !email || !password || !confirmPassword) {
        alert("All fields are required!");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }

    try {
        const res = await fetch(apiUrl("/api/auth/signup"), fetchOptions({
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({ name, email, password }),
        }));

        const data = await res.json();

        if (!res.ok) {
            alert(data.msg || "Signup failed");
            return false;
        }

        if (data.user) {
            localStorage.setItem("userName", data.user.name || "");
            localStorage.setItem("userEmail", data.user.email || "");
        }

        alert("Signup successful! Please login.");
        window.location.href = "login.html";
    } catch (error) {
        console.error(error);
        alert("Server error!");
    }

    return false;
}

function goToLogin(event) {
    event.preventDefault();

    const token = getToken();

    if (token) {
        window.location.href = "pages/dashboard.html";
    } else {
        alert("Please login first!");
        window.location.href = "pages/login.html";
    }
}

function logoutUser() {
    localStorage.removeItem("token");
    alert("Signed out successfully!");
    window.location.href = getLoginPagePath();
}

async function saveProfile(event) {
    event.preventDefault();

    const nameInput = document.querySelector("input[name='name']");
    const emailInput = document.querySelector("input[name='email']");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    const token = getToken();

    if (token && (name || email)) {
        try {
            await fetch(apiUrl("/api/user/me"), fetchOptions({
                method: "PUT",
                headers: authHeaders(true),
                body: JSON.stringify({ name, email }),
            }));
        } catch (error) {
            console.error(error);
        }
    }

    alert("Profile saved successfully!");
    return false;
}

function loadProfileData() {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    const nameInput = document.querySelector("input[name='name']");
    const emailInput = document.querySelector("input[name='email']");

    if (nameInput && name) nameInput.value = name;
    if (emailInput && email) emailInput.value = email;
}

function loadUserProfile() {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    const nameEl = document.getElementById("userNameDisplay");
    const emailEl = document.getElementById("userEmailDisplay");

    if (nameEl && name) nameEl.innerText = name;
    if (emailEl && email) emailEl.innerText = email;
}

function scrollToFeatures() {
    const section = document.getElementById("features");
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

function bindAppearanceThemeOptions() {
    const settingItems = document.querySelectorAll(".settings-list .setting-item");

    settingItems.forEach((item) => {
        item.addEventListener("click", function () {
            const text = item.textContent.toLowerCase();

            if (text.includes("light")) {
                setTheme("light-theme");
                return;
            }

            if (text.includes("dark")) {
                setTheme("dark-theme");
                return;
            }

            if (text.includes("default")) {
                setTheme("");
            }
        });
    });
}

function renderResumeInsights(analysis) {
    const scoreEl = document.getElementById("resumeScore");
    const feedbackEl = document.getElementById("resumeFeedback");
    const skillsEl = document.getElementById("resumeSkills");
    const improvementsEl = document.getElementById("resumeImprovements");
    const jobsEl = document.getElementById("jobRecommendations");

    if (scoreEl) {
        scoreEl.innerText = `${analysis.score ?? 0}/100`;
    }

    if (feedbackEl) {
        feedbackEl.innerText = analysis.summary || "Resume analyzed successfully.";
    }

    if (skillsEl) {
        const skills = Array.isArray(analysis.skills) ? analysis.skills : [];
        skillsEl.innerHTML = skills.length
            ? skills.map((skill) => `<li>${skill}</li>`).join("")
            : "<li>No skills extracted yet.</li>";
    }

    if (improvementsEl) {
        const improvements = Array.isArray(analysis.improvements) ? analysis.improvements : [];
        improvementsEl.innerHTML = improvements.length
            ? improvements.map((item) => `<li>${item}</li>`).join("")
            : "<li>No improvements generated yet.</li>";
    }

    if (jobsEl) {
        const jobMatches = Array.isArray(analysis.jobMatches) ? analysis.jobMatches : [];
        jobsEl.innerHTML = jobMatches.length
            ? jobMatches.map((job) => `<li><strong>${job.title}</strong> - Match ${job.matchScore}%</li>`).join("")
            : "<li>Upload a resume to get job recommendations.</li>";
    }
}

async function uploadResume(event) {
    event.preventDefault();
    const submitButton = event.submitter || event.target.querySelector("button[type='submit']");

    const token = getToken();
    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return false;
    }

    const fileInput = document.querySelector("input[name='resume']");
    if (!fileInput || !fileInput.files || !fileInput.files.length) {
        alert("Please select a resume file.");
        return false;
    }

    const formData = new FormData();
    formData.append("resume", fileInput.files[0]);

    try {
        setLoadingButton(submitButton, true, "Analyzing...");

        const res = await fetch(apiUrl("/api/resume/upload"), fetchOptions({
            method: "POST",
            headers: authHeaders(false),
            body: formData,
        }));

        const data = await res.json();

        if (!res.ok) {
            alert(data.msg || "Resume upload failed.");
            return false;
        }

        const analysis = data.analysis || data.resume || {};
        renderResumeInsights(analysis);

        alert("Resume uploaded and analyzed successfully!");
    } catch (error) {
        console.error(error);
        alert("Server error while uploading resume.");
    } finally {
        setLoadingButton(submitButton, false);
    }

    return false;
}

async function loadLatestResumeInsights() {
    if (!document.getElementById("resumeScore")) return;
    if (!getToken()) return;

    try {
        const res = await fetch(apiUrl("/api/resume/my"), fetchOptions({
            method: "GET",
            headers: authHeaders(false),
        }));

        if (!res.ok) return;

        const data = await res.json();
        const latest = Array.isArray(data.resumes) ? data.resumes[0] : null;
        if (!latest) return;

        renderResumeInsights({
            score: latest.score,
            summary: latest.summary || latest.feedback,
            skills: latest.skills,
            improvements: latest.improvements,
            jobMatches: latest.jobMatches,
        });
    } catch (error) {
        console.error(error);
    }
}

async function loadAssessmentCatalog() {
    const catalogEl = document.getElementById("assessmentCatalog");
    if (!catalogEl || !getToken()) return;

    try {
        const res = await fetch(apiUrl("/api/tests/catalog"), fetchOptions({
            method: "GET",
            headers: authHeaders(false),
        }));

        if (!res.ok) return;

        const data = await res.json();
        const assessments = Array.isArray(data.assessments) ? data.assessments : [];

        catalogEl.innerHTML = assessments.map((item) => `
            <div class="test-card" onclick="startAssessment('${item.key}')">
                <h3>${item.label}</h3>
                <p>${item.description}</p>
                <p>Questions available: ${item.questionCount}</p>
            </div>
        `).join("");
    } catch (error) {
        console.error(error);
    }
}

async function startAssessment(category) {
    if (!getToken()) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(apiUrl(`/api/tests/start/${category}`), fetchOptions({
            method: "GET",
            headers: authHeaders(false),
        }));
        const data = await res.json();

        if (!res.ok) {
            alert(data.msg || "Unable to start assessment.");
            return;
        }

        currentAssessment = {
            category: data.category,
            questions: data.questions || [],
        };

        const panel = document.getElementById("assessmentPanel");
        const title = document.getElementById("assessmentTitle");
        const questionsEl = document.getElementById("assessmentQuestions");

        if (!panel || !title || !questionsEl) return;

        title.innerText = `${data.category.toUpperCase()} Assessment`;
        questionsEl.innerHTML = currentAssessment.questions.map((question, index) => `
            <div class="question-card">
                <p><strong>Q${index + 1}.</strong> ${question.question}</p>
                ${question.options.map((option, optionIndex) => `
                    <label class="option-item">
                        <input type="radio" name="${question.id}" value="${optionIndex}" required>
                        <span>${option}</span>
                    </label>
                `).join("")}
            </div>
        `).join("");

        panel.style.display = "block";
        panel.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.error(error);
        alert("Server error while starting assessment.");
    }
}

async function submitAssessment(event) {
    event.preventDefault();
    const submitButton = event.submitter || event.target.querySelector("button[type='submit']");

    if (!currentAssessment || !currentAssessment.questions || !currentAssessment.questions.length) {
        alert("Start an assessment first.");
        return false;
    }

    const answers = currentAssessment.questions.map((question) => {
        const selected = document.querySelector(`input[name="${question.id}"]:checked`);
        return {
            questionId: question.id,
            selectedIndex: selected ? Number(selected.value) : -1,
        };
    }).filter((item) => item.selectedIndex >= 0);

    if (answers.length !== currentAssessment.questions.length) {
        alert("Please answer all questions before submitting.");
        return false;
    }

    try {
        setLoadingButton(submitButton, true, "Submitting...");

        const res = await fetch(apiUrl("/api/tests/submit"), fetchOptions({
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({
                category: currentAssessment.category,
                answers,
            }),
        }));

        const data = await res.json();

        if (!res.ok) {
            alert(data.msg || "Submission failed.");
            return false;
        }

        localStorage.setItem("latestAssessmentResult", JSON.stringify(data.attempt || {}));
        alert(`Assessment submitted! Score: ${data.attempt.score}%`);
        window.location.href = `results.html?updated=${Date.now()}`;
    } catch (error) {
        console.error(error);
        alert("Server error while submitting assessment.");
    } finally {
        setLoadingButton(submitButton, false);
    }

    return false;
}

async function loadInterviewCatalog() {
    const catalogEl = document.getElementById("interviewCatalog");
    if (!catalogEl || !getToken()) return;

    try {
        const res = await fetch(apiUrl("/api/interview/catalog"), fetchOptions({
            method: "GET",
            headers: authHeaders(false),
        }));

        if (!res.ok) return;

        const data = await res.json();
        const tracks = Array.isArray(data.tracks) ? data.tracks : [];

        catalogEl.innerHTML = tracks.map((item) => `
            <div class="card" onclick="startInterviewTrack('${item.key}')">
                <h3>${item.label}</h3>
                <p>${item.description}</p>
                <p>Questions available: ${item.questionCount}</p>
            </div>
        `).join("");
    } catch (error) {
        console.error(error);
    }
}

async function startInterviewTrack(track) {
    if (!getToken()) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(apiUrl(`/api/interview/start/${track}?count=5`), fetchOptions({
            method: "GET",
            headers: authHeaders(false),
        }));

        const data = await res.json();

        if (!res.ok) {
            alert(data.msg || "Unable to start interview track.");
            return;
        }

        currentInterviewSession = {
            track: data.track,
            questions: data.questions || [],
        };

        const panel = document.getElementById("interviewPanel");
        const title = document.getElementById("interviewTitle");
        const questionsEl = document.getElementById("interviewQuestions");

        if (!panel || !title || !questionsEl) return;

        title.innerText = `${data.track.toUpperCase()} Interview`;
        questionsEl.innerHTML = currentInterviewSession.questions.map((question, index) => `
            <div class="question-card">
                <p><strong>Q${index + 1}.</strong> ${question.question}</p>
                <p><small>Focus: ${(question.focusAreas || []).join(", ")}</small></p>
                <textarea class="interview-answer" name="interview_${question.id}" rows="4" placeholder="Type your answer here..." required></textarea>
            </div>
        `).join("");

        panel.style.display = "block";
        panel.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        console.error(error);
        alert("Server error while starting interview.");
    }
}

function renderInterviewResult(attempt) {
    const panel = document.getElementById("interviewResultPanel");
    const scoreEl = document.getElementById("interviewOverallScore");
    const feedbackEl = document.getElementById("interviewOverallFeedback");
    const strengthsEl = document.getElementById("interviewStrengths");
    const improvementsEl = document.getElementById("interviewImprovements");
    const detailsEl = document.getElementById("interviewQuestionFeedback");

    if (!panel || !scoreEl || !feedbackEl || !strengthsEl || !improvementsEl || !detailsEl) return;

    scoreEl.innerText = `${attempt.overallScore || 0}`;
    feedbackEl.innerText = attempt.overallFeedback || "Interview evaluated successfully.";

    const strengths = Array.isArray(attempt.strengths) ? attempt.strengths : [];
    const improvements = Array.isArray(attempt.improvements) ? attempt.improvements : [];
    const details = Array.isArray(attempt.details) ? attempt.details : [];

    strengthsEl.innerHTML = strengths.length
        ? strengths.map((item) => `<li>${item}</li>`).join("")
        : "<li>Keep practicing with detailed examples.</li>";

    improvementsEl.innerHTML = improvements.length
        ? improvements.map((item) => `<li>${item}</li>`).join("")
        : "<li>Continue refining your communication and impact statements.</li>";

    detailsEl.innerHTML = details.length
        ? details.map((item, index) => `
            <div class="question-card">
                <p><strong>Question ${index + 1} Score:</strong> ${item.score || 0}%</p>
                <p>${item.question || ""}</p>
                <p><strong>Feedback:</strong> ${item.feedback || "No feedback generated."}</p>
            </div>
        `).join("")
        : "<p>No question-wise feedback available.</p>";

    panel.style.display = "block";
}

async function submitInterviewSession(event) {
    event.preventDefault();
    const submitButton = event.submitter || event.target.querySelector("button[type='submit']");

    if (!currentInterviewSession || !currentInterviewSession.questions || !currentInterviewSession.questions.length) {
        alert("Start an interview track first.");
        return false;
    }

    const answers = currentInterviewSession.questions.map((question) => {
        const input = document.querySelector(`textarea[name="interview_${question.id}"]`);
        return {
            questionId: question.id,
            answerText: input ? input.value.trim() : "",
        };
    }).filter((item) => item.answerText);

    if (answers.length !== currentInterviewSession.questions.length) {
        alert("Please answer all interview questions before submitting.");
        return false;
    }

    try {
        setLoadingButton(submitButton, true, "Evaluating...");

        const res = await fetch(apiUrl("/api/interview/submit"), fetchOptions({
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({
                track: currentInterviewSession.track,
                answers,
            }),
        }));

        const data = await res.json();

        if (!res.ok) {
            alert(data.msg || "Interview submission failed.");
            return false;
        }

        localStorage.setItem("latestInterviewResult", JSON.stringify(data.attempt || {}));
        renderInterviewResult(data.attempt || {});
        alert(`Interview submitted! Overall score: ${data.attempt.overallScore}%`);
    } catch (error) {
        console.error(error);
        alert("Server error while submitting interview.");
    } finally {
        setLoadingButton(submitButton, false);
    }

    return false;
}

async function loadLatestInterviewResult() {
    const panel = document.getElementById("interviewResultPanel");
    if (!panel || !getToken()) return;

    try {
        const cached = JSON.parse(localStorage.getItem("latestInterviewResult") || "null");
        if (cached) renderInterviewResult(cached);
    } catch (error) {
        console.error(error);
    }

    try {
        const res = await fetch(apiUrl("/api/interview/history"), fetchOptions({
            method: "GET",
            headers: authHeaders(false),
        }));

        if (!res.ok) return;

        const data = await res.json();
        const latest = Array.isArray(data.attempts) ? data.attempts[0] : null;
        if (!latest) return;

        renderInterviewResult(latest);
    } catch (error) {
        console.error(error);
    }
}

function setScoreCard(category, score) {
    const bar = document.getElementById(`${category}Bar`);
    const text = document.getElementById(`${category}Score`);

    if (bar) {
        bar.style.width = `${Math.max(0, Math.min(100, Number(score) || 0))}%`;
    }

    if (text) {
        text.innerText = `${Math.round(Number(score) || 0)}%`;
    }
}

function renderLatestAssessmentResult(attempt) {
    if (!attempt || !attempt.category) return;

    const category = String(attempt.category || "").toLowerCase();
    if (["aptitude", "technical", "coding", "hr"].includes(category)) {
        setScoreCard(category, attempt.score || 0);
    }

    const overallEl = document.getElementById("overallScoreValue");
    if (overallEl) {
        overallEl.innerText = `${Math.round(Number(attempt.score) || 0)}%`;
    }

    const attemptsEl = document.getElementById("totalAttempts");
    if (attemptsEl && Number(attemptsEl.innerText || 0) === 0) {
        attemptsEl.innerText = "1";
    }
}

async function loadResultsDashboard() {
    const overallEl = document.getElementById("overallScoreValue");
    if (!overallEl || !getToken()) return;

    try {
        const latest = JSON.parse(localStorage.getItem("latestAssessmentResult") || "null");
        renderLatestAssessmentResult(latest);
    } catch (error) {
        console.error(error);
    }

    try {
        const res = await fetch(apiUrl(`/api/tests/summary?updated=${Date.now()}`), fetchOptions({
            method: "GET",
            headers: authHeaders(false),
        }));

        if (!res.ok) return;

        const data = await res.json();
        const summary = data.summary || {};

        overallEl.innerText = `${summary.overallScore || 0}%`;

        const categoryStats = Array.isArray(summary.categoryStats) ? summary.categoryStats : [];
        const scores = {};
        categoryStats.forEach((item) => {
            scores[item.category] = item.latestScore || item.averageScore || 0;
        });

        setScoreCard("aptitude", scores.aptitude || 0);
        setScoreCard("technical", scores.technical || 0);
        setScoreCard("coding", scores.coding || 0);
        setScoreCard("hr", scores.hr || 0);

        const attemptsEl = document.getElementById("totalAttempts");
        if (attemptsEl) {
            attemptsEl.innerText = summary.totalAttempts || 0;
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav-links a");

    links.forEach((link) => {
        link.addEventListener("click", function () {
            links.forEach((current) => current.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

