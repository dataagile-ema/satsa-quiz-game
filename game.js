/**
 * SATSA - Main Game Logic
 * A risk/reward quiz game with level progression
 */

// ============================================
// CONSTANTS
// ============================================

const LEVEL_POINTS = [0, 100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200];
const SAFE_LEVELS = [5, 10];
const BASE_TIME = 30;
const TIME_DECREASE_PER_LEVEL = 2;
const MIN_TIME = 10;

// ============================================
// GAME STATE
// ============================================

const GameState = {
    players: [],
    currentPlayerIndex: 0,
    category: "mixed",
    totalRounds: 10,
    currentRound: 1,
    pot: 0,
    streak: 0,
    currentLevel: 0,
    safePoints: 0,
    questionsAnswered: 0,
    usedQuestionIndices: new Set(),
    timerInterval: null,
    timeLeft: BASE_TIME,
    isMultiplayer: false,
    gameOver: false,
    soundEnabled: true
};

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
    screens: {
        start: document.getElementById("start-screen"),
        setup: document.getElementById("setup-screen"),
        game: document.getElementById("game-screen"),
        gameover: document.getElementById("gameover-screen"),
        highscore: document.getElementById("highscore-screen"),
        rules: document.getElementById("rules-screen")
    },
    btnSolo: document.getElementById("btn-solo"),
    btnMultiplayer: document.getElementById("btn-multiplayer"),
    btnHighscore: document.getElementById("btn-highscore"),
    btnRules: document.getElementById("btn-rules"),
    playerInputs: document.getElementById("player-inputs"),
    btnAddPlayer: document.getElementById("btn-add-player"),
    categoryButtons: document.querySelectorAll(".category-btn"),
    btnBackSetup: document.getElementById("btn-back-setup"),
    btnStartGame: document.getElementById("btn-start-game"),
    currentRound: document.getElementById("current-round"),
    totalRounds: document.getElementById("total-rounds"),
    currentPlayerName: document.getElementById("current-player-name"),
    totalPoints: document.getElementById("total-points"),
    potAmount: document.getElementById("pot-amount"),
    potContainer: document.querySelector(".pot-container"),
    levelLadder: document.getElementById("level-ladder"),
    timerFill: document.getElementById("timer-fill"),
    timerText: document.getElementById("timer-text"),
    streakIndicator: document.getElementById("streak-indicator"),
    questionCategory: document.getElementById("question-category"),
    questionText: document.getElementById("question-text"),
    answersContainer: document.getElementById("answers-container"),
    btnBank: document.getElementById("btn-bank"),
    resultOverlay: document.getElementById("result-overlay"),
    resultIcon: document.getElementById("result-icon"),
    resultText: document.getElementById("result-text"),
    resultPoints: document.getElementById("result-points"),
    btnContinue: document.getElementById("btn-continue"),
    finalResults: document.getElementById("final-results"),
    highscoreMessage: document.getElementById("highscore-message"),
    btnPlayAgain: document.getElementById("btn-play-again"),
    btnMainMenu: document.getElementById("btn-main-menu"),
    highscoreList: document.getElementById("highscore-list"),
    btnBackHighscore: document.getElementById("btn-back-highscore"),
    btnBackRules: document.getElementById("btn-back-rules")
};

// ============================================
// AUDIO SYSTEM
// ============================================

const AudioSystem = {
    context: null,
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log("Web Audio API not supported");
        }
    },
    playTone(frequency, duration, type = "sine") {
        if (!this.context || !GameState.soundEnabled) return;
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + duration);
    },
    correct() {
        this.playTone(523.25, 0.1);
        setTimeout(() => this.playTone(659.25, 0.1), 100);
        setTimeout(() => this.playTone(783.99, 0.15), 200);
    },
    wrong() {
        this.playTone(200, 0.3, "sawtooth");
        setTimeout(() => this.playTone(150, 0.4, "sawtooth"), 150);
    },
    bank() {
        this.playTone(440, 0.1);
        setTimeout(() => this.playTone(554.37, 0.1), 80);
        setTimeout(() => this.playTone(659.25, 0.1), 160);
        setTimeout(() => this.playTone(880, 0.2), 240);
    },
    click() { this.playTone(800, 0.05); },
    tick() { this.playTone(600, 0.02); },
    safeLevel() {
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.15), i * 100);
        });
    },
    gameOver() {
        [523.25, 493.88, 440, 392, 349.23, 329.63, 293.66, 261.63].forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.15), i * 150);
        });
    },
    victory() {
        [523.25, 659.25, 783.99, 1046.50].forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.2), i * 150);
        });
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showScreen(screenName) {
    Object.values(DOM.screens).forEach(screen => screen.classList.remove("active"));
    DOM.screens[screenName].classList.add("active");
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function formatNumber(num) {
    return num.toLocaleString("sv-SE");
}

// ============================================
// TIMER SYSTEM
// ============================================

function getTimeForLevel(level) {
    return Math.max(BASE_TIME - (level * TIME_DECREASE_PER_LEVEL), MIN_TIME);
}

function startTimer() {
    stopTimer();
    GameState.timeLeft = getTimeForLevel(GameState.currentLevel);
    updateTimerDisplay();
    GameState.timerInterval = setInterval(() => {
        GameState.timeLeft--;
        updateTimerDisplay();
        if (GameState.timeLeft <= 5 && GameState.timeLeft > 0) AudioSystem.tick();
        if (GameState.timeLeft <= 0) handleTimeOut();
    }, 1000);
}

function stopTimer() {
    if (GameState.timerInterval) {
        clearInterval(GameState.timerInterval);
        GameState.timerInterval = null;
    }
}

function updateTimerDisplay() {
    if (DOM.timerText) DOM.timerText.textContent = GameState.timeLeft;
    if (DOM.timerFill) {
        const percent = (GameState.timeLeft / getTimeForLevel(GameState.currentLevel)) * 100;
        DOM.timerFill.style.width = percent + "%";
        DOM.timerFill.classList.toggle("warning", GameState.timeLeft <= 5);
    }
}

function handleTimeOut() {
    stopTimer();
    AudioSystem.wrong();
    document.querySelectorAll(".answer-btn").forEach(btn => {
        btn.disabled = true;
        btn.removeEventListener("click", handleAnswer);
        if (parseInt(btn.dataset.originalIndex) === GameState.currentQuestion.correct) {
            btn.classList.add("correct");
        }
    });
    const lostPoints = GameState.pot - GameState.safePoints;
    GameState.pot = GameState.safePoints;
    GameState.currentLevel = GameState.safePoints > 0 ? 5 : 0;
    GameState.streak = 0;
    DOM.potContainer.classList.add("shake");
    setTimeout(() => DOM.potContainer.classList.remove("shake"), 500);
    updateUI();
    updateLevelLadder();
    showResult("timeout", lostPoints);
}

// ============================================
// LEVEL LADDER SYSTEM
// ============================================

function updateLevelLadder() {
    if (!DOM.levelLadder) return;
    DOM.levelLadder.querySelectorAll(".level-step").forEach(step => {
        const level = parseInt(step.dataset.level);
        step.classList.remove("current", "completed", "next");
        if (level === GameState.currentLevel) step.classList.add("current");
        else if (level < GameState.currentLevel) step.classList.add("completed");
        else if (level === GameState.currentLevel + 1) step.classList.add("next");
    });
}

function checkSafeLevel() {
    if (SAFE_LEVELS.includes(GameState.currentLevel)) {
        GameState.safePoints = GameState.pot;
        AudioSystem.safeLevel();
        return true;
    }
    return false;
}

// ============================================
// HIGHSCORE SYSTEM
// ============================================

const HighscoreSystem = {
    KEY: "satsa_highscores",
    MAX_ENTRIES: 10,
    getScores() {
        try {
            const data = localStorage.getItem(this.KEY);
            return data ? JSON.parse(data) : [];
        } catch { return []; }
    },
    saveScore(name, score) {
        const scores = this.getScores();
        const newEntry = { name, score, date: new Date().toLocaleDateString("sv-SE") };
        scores.push(newEntry);
        scores.sort((a, b) => b.score - a.score);
        scores.splice(this.MAX_ENTRIES);
        try { localStorage.setItem(this.KEY, JSON.stringify(scores)); } catch {}
        return scores.findIndex(s => s.name === name && s.score === score) + 1;
    },
    isHighscore(score) {
        const scores = this.getScores();
        return scores.length < this.MAX_ENTRIES || score > scores[scores.length - 1].score;
    },
    render() {
        const scores = this.getScores();
        if (scores.length === 0) {
            DOM.highscoreList.innerHTML = '<p class="no-scores">Inga poang annu!</p>';
            return;
        }
        DOM.highscoreList.innerHTML = scores.map((entry, i) =>
            '<div class="highscore-item"><span class="position">' + (i+1) + '.</span>' +
            '<span class="name">' + entry.name + '</span>' +
            '<span class="score">' + formatNumber(entry.score) + '</span></div>'
        ).join("");
    }
};

// ============================================
// GAME LOGIC
// ============================================

function resetGameState() {
    GameState.currentRound = 1;
    GameState.pot = 0;
    GameState.streak = 0;
    GameState.currentLevel = 0;
    GameState.safePoints = 0;
    GameState.questionsAnswered = 0;
    GameState.usedQuestionIndices.clear();
    GameState.currentPlayerIndex = 0;
    GameState.gameOver = false;
    GameState.timeLeft = BASE_TIME;
    stopTimer();
    GameState.players.forEach(p => p.score = 0);
}

function getCurrentPlayer() {
    return GameState.players[GameState.currentPlayerIndex];
}

function getRandomQuestion() {
    const questions = QUESTIONS[GameState.category];
    const available = [];
    for (let i = 0; i < questions.length; i++) {
        if (!GameState.usedQuestionIndices.has(i)) available.push(i);
    }
    if (available.length === 0) {
        GameState.usedQuestionIndices.clear();
        for (let i = 0; i < questions.length; i++) available.push(i);
    }
    const idx = available[Math.floor(Math.random() * available.length)];
    GameState.usedQuestionIndices.add(idx);
    return { ...questions[idx], index: idx };
}

function updateUI() {
    const player = getCurrentPlayer();
    DOM.currentRound.textContent = GameState.currentRound;
    DOM.totalRounds.textContent = GameState.totalRounds;
    DOM.currentPlayerName.textContent = player.name;
    DOM.totalPoints.textContent = formatNumber(player.score);
    DOM.potAmount.textContent = formatNumber(GameState.pot);
    DOM.potContainer.classList.remove("hot", "burning");
    if (GameState.currentLevel >= 7) DOM.potContainer.classList.add("burning");
    else if (GameState.currentLevel >= 4) DOM.potContainer.classList.add("hot");
    updateStreakIndicator();
    updateLevelLadder();
    DOM.btnBank.disabled = GameState.pot === 0;
}

function updateStreakIndicator() {
    let html = "";
    for (let i = 0; i < 10; i++) {
        const active = i < GameState.currentLevel;
        const safe = SAFE_LEVELS.includes(i + 1) && active;
        html += '<div class="streak-dot ' + (active ? 'active ' : '') + (safe ? 'safe' : '') + '"></div>';
    }
    DOM.streakIndicator.innerHTML = html;
}

function displayQuestion() {
    const question = getRandomQuestion();
    GameState.currentQuestion = question;
    const cat = question.category || GameState.category;
    DOM.questionCategory.textContent = CATEGORY_ICONS[cat] + " " + CATEGORY_NAMES[cat];
    DOM.questionText.textContent = question.question;
    const shuffled = shuffleArray([0, 1, 2, 3]);
    DOM.answersContainer.innerHTML = shuffled.map(i =>
        '<button class="answer-btn" data-original-index="' + i + '">' + question.answers[i] + '</button>'
    ).join("");
    document.querySelectorAll(".answer-btn").forEach(btn => btn.addEventListener("click", handleAnswer));
    startTimer();
}

function handleAnswer(e) {
    stopTimer();
    const selected = parseInt(e.target.dataset.originalIndex);
    const correct = GameState.currentQuestion.correct;
    const isCorrect = selected === correct;
    document.querySelectorAll(".answer-btn").forEach(btn => {
        btn.disabled = true;
        btn.removeEventListener("click", handleAnswer);
        const idx = parseInt(btn.dataset.originalIndex);
        if (idx === correct) btn.classList.add("correct");
        else if (idx === selected && !isCorrect) btn.classList.add("wrong");
    });
    isCorrect ? handleCorrectAnswer() : handleWrongAnswer();
}

function handleCorrectAnswer() {
    AudioSystem.correct();
    GameState.currentLevel++;
    GameState.pot = LEVEL_POINTS[GameState.currentLevel];
    GameState.streak++;
    const reachedSafe = checkSafeLevel();
    DOM.potAmount.classList.add("pop");
    setTimeout(() => DOM.potAmount.classList.remove("pop"), 300);
    updateUI();
    showResult(reachedSafe ? "safe" : "correct", GameState.pot);
}

function handleWrongAnswer() {
    AudioSystem.wrong();
    const lost = GameState.pot - GameState.safePoints;
    GameState.pot = GameState.safePoints;
    GameState.currentLevel = GameState.safePoints > 0 ? 5 : 0;
    GameState.streak = 0;
    DOM.potContainer.classList.add("shake");
    setTimeout(() => DOM.potContainer.classList.remove("shake"), 500);
    updateUI();
    showResult("wrong", lost);
}

function handleBank() {
    stopTimer();
    AudioSystem.bank();
    const banked = GameState.pot;
    getCurrentPlayer().score += banked;
    GameState.pot = 0;
    GameState.currentLevel = 0;
    GameState.safePoints = 0;
    GameState.streak = 0;
    updateUI();
    showResult("banked", banked);
}

function showResult(type, points) {
    DOM.resultOverlay.classList.remove("hidden");
    const icons = { correct: "\u2713", safe: "\u2605", wrong: "\u2717", timeout: "\u23F0", banked: "\uD83D\uDCB0" };
    const titles = { correct: "RATT!", safe: "SAKER NIVA!", wrong: "FEL!", timeout: "TIDEN SLUT!", banked: "BANKAT!" };
    DOM.resultIcon.textContent = icons[type];
    DOM.resultText.textContent = titles[type];
    DOM.resultText.className = "result-text " + (type === "safe" ? "safe" : type === "banked" ? "banked" : type === "correct" ? "correct" : "wrong");

    if (type === "correct") {
        DOM.resultPoints.textContent = "Niva " + GameState.currentLevel + " - " + formatNumber(points) + " i potten";
        DOM.btnContinue.textContent = GameState.currentLevel >= 10 ? "Banka (max)" : "Nasta fraga";
    } else if (type === "safe") {
        DOM.resultPoints.textContent = formatNumber(points) + " poang sakrade!";
        DOM.btnContinue.textContent = GameState.currentLevel >= 10 ? "Banka (max)" : "Fortsatt";
    } else if (type === "wrong" || type === "timeout") {
        DOM.resultPoints.textContent = GameState.safePoints > 0
            ? "Forlorade " + formatNumber(points) + ". " + formatNumber(GameState.safePoints) + " kvar!"
            : (points > 0 ? "Forlorade " + formatNumber(points) : "Inga poang forlorade");
        DOM.btnContinue.textContent = "Fortsatt";
    } else {
        DOM.resultPoints.textContent = "+" + formatNumber(points) + " sakrade";
        DOM.btnContinue.textContent = "Fortsatt";
    }
}

function continueGame() {
    DOM.resultOverlay.classList.add("hidden");
    if (GameState.currentLevel >= 10) { handleBank(); return; }
    GameState.pot === 0 ? nextTurn() : displayQuestion();
}

function nextTurn() {
    stopTimer();
    GameState.pot = 0;
    GameState.currentLevel = 0;
    GameState.safePoints = 0;
    GameState.streak = 0;
    if (GameState.isMultiplayer) {
        GameState.currentPlayerIndex++;
        if (GameState.currentPlayerIndex >= GameState.players.length) {
            GameState.currentPlayerIndex = 0;
            GameState.currentRound++;
        }
    } else {
        GameState.currentRound++;
    }
    if (GameState.currentRound > GameState.totalRounds) { endGame(); return; }
    updateUI();
    displayQuestion();
}

function endGame() {
    stopTimer();
    GameState.gameOver = true;
    const sorted = [...GameState.players].sort((a, b) => b.score - a.score);
    let isNew = false;
    if (!GameState.isMultiplayer && sorted[0].score > 0) {
        isNew = HighscoreSystem.isHighscore(sorted[0].score);
        if (isNew) { HighscoreSystem.saveScore(sorted[0].name, sorted[0].score); AudioSystem.victory(); }
        else AudioSystem.gameOver();
    } else AudioSystem.victory();
    DOM.finalResults.innerHTML = sorted.map((p, i) => {
        const rank = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
        return '<div class="final-result-item ' + (i === 0 ? 'winner' : '') + '">' +
            '<span class="rank ' + rank + '">' + (i+1) + '.</span>' +
            '<span class="player-name">' + p.name + '</span>' +
            '<span class="final-score">' + formatNumber(p.score) + '</span></div>';
    }).join("");
    DOM.highscoreMessage.classList.toggle("hidden", !isNew);
    showScreen("gameover");
}

// ============================================
// SETUP FUNCTIONS
// ============================================

function setupPlayerInputs(count) {
    DOM.playerInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const div = document.createElement("div");
        div.className = "player-input-group";
        div.innerHTML = '<label>Spelare ' + (i + 1) + '</label>' +
            '<input type="text" class="player-name-input" placeholder="Namn" maxlength="15">';
        DOM.playerInputs.appendChild(div);
    }
    updateAddPlayerButton();
}

function updateAddPlayerButton() {
    const count = DOM.playerInputs.querySelectorAll(".player-input-group").length;
    DOM.btnAddPlayer.disabled = count >= 4;
    DOM.btnAddPlayer.style.display = GameState.isMultiplayer ? "block" : "none";
}

function addPlayer() {
    const count = DOM.playerInputs.querySelectorAll(".player-input-group").length;
    if (count >= 4) return;
    const div = document.createElement("div");
    div.className = "player-input-group";
    div.innerHTML = '<label>Spelare ' + (count + 1) + '</label>' +
        '<input type="text" class="player-name-input" placeholder="Namn" maxlength="15">';
    DOM.playerInputs.appendChild(div);
    updateAddPlayerButton();
    AudioSystem.click();
}

function selectCategory(e) {
    const btn = e.target.closest(".category-btn");
    if (!btn) return;
    DOM.categoryButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    GameState.category = btn.dataset.category;
    AudioSystem.click();
}

function validateSetup() {
    const inputs = DOM.playerInputs.querySelectorAll(".player-name-input");
    const names = Array.from(inputs).map(i => i.value.trim());
    return names.every(n => n.length > 0) && document.querySelector(".category-btn.selected");
}

function startGame() {
    if (!validateSetup()) {
        DOM.btnStartGame.classList.add("shake");
        setTimeout(() => DOM.btnStartGame.classList.remove("shake"), 500);
        return;
    }
    const inputs = DOM.playerInputs.querySelectorAll(".player-name-input");
    GameState.players = Array.from(inputs).map(i => ({ name: i.value.trim(), score: 0 }));
    resetGameState();
    updateUI();
    showScreen("game");
    displayQuestion();
    AudioSystem.click();
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    DOM.btnSolo.addEventListener("click", () => {
        GameState.isMultiplayer = false;
        setupPlayerInputs(1);
        showScreen("setup");
        AudioSystem.click();
    });
    DOM.btnMultiplayer.addEventListener("click", () => {
        GameState.isMultiplayer = true;
        setupPlayerInputs(2);
        showScreen("setup");
        AudioSystem.click();
    });
    DOM.btnHighscore.addEventListener("click", () => {
        HighscoreSystem.render();
        showScreen("highscore");
        AudioSystem.click();
    });
    DOM.btnRules.addEventListener("click", () => {
        showScreen("rules");
        AudioSystem.click();
    });
    DOM.btnAddPlayer.addEventListener("click", addPlayer);
    DOM.categoryButtons.forEach(btn => btn.addEventListener("click", selectCategory));
    DOM.btnBackSetup.addEventListener("click", () => { showScreen("start"); AudioSystem.click(); });
    DOM.btnStartGame.addEventListener("click", startGame);
    DOM.btnBank.addEventListener("click", handleBank);
    DOM.btnContinue.addEventListener("click", continueGame);
    DOM.btnPlayAgain.addEventListener("click", () => {
        resetGameState();
        updateUI();
        showScreen("game");
        displayQuestion();
        AudioSystem.click();
    });
    DOM.btnMainMenu.addEventListener("click", () => { stopTimer(); showScreen("start"); AudioSystem.click(); });
    DOM.btnBackHighscore.addEventListener("click", () => { showScreen("start"); AudioSystem.click(); });
    DOM.btnBackRules.addEventListener("click", () => { showScreen("start"); AudioSystem.click(); });
    document.addEventListener("click", () => {
        if (!AudioSystem.context) AudioSystem.init();
    }, { once: true });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    document.querySelector('.category-btn[data-category="mixed"]').classList.add("selected");
    initEventListeners();
    showScreen("start");
    console.log("SATSA initialized with level system!");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
