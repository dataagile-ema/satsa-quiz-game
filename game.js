/**
 * SATSA - Main Game Logic
 * A risk/reward quiz game
 */

// ============================================
// GAME STATE
// ============================================

const GameState = {
    // Players
    players: [],
    currentPlayerIndex: 0,

    // Game settings
    category: 'mixed',
    totalRounds: 10,
    currentRound: 1,

    // Current round state
    pot: 0,
    streak: 0,
    questionsAnswered: 0,
    usedQuestionIndices: new Set(),

    // Game mode
    isMultiplayer: false,
    gameOver: false,

    // Audio
    soundEnabled: true
};

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
    // Screens
    screens: {
        start: document.getElementById('start-screen'),
        setup: document.getElementById('setup-screen'),
        game: document.getElementById('game-screen'),
        gameover: document.getElementById('gameover-screen'),
        highscore: document.getElementById('highscore-screen'),
        rules: document.getElementById('rules-screen')
    },

    // Start screen
    btnSolo: document.getElementById('btn-solo'),
    btnMultiplayer: document.getElementById('btn-multiplayer'),
    btnHighscore: document.getElementById('btn-highscore'),
    btnRules: document.getElementById('btn-rules'),

    // Setup screen
    playerInputs: document.getElementById('player-inputs'),
    btnAddPlayer: document.getElementById('btn-add-player'),
    categoryButtons: document.querySelectorAll('.category-btn'),
    btnBackSetup: document.getElementById('btn-back-setup'),
    btnStartGame: document.getElementById('btn-start-game'),

    // Game screen
    currentRound: document.getElementById('current-round'),
    totalRounds: document.getElementById('total-rounds'),
    currentPlayerName: document.getElementById('current-player-name'),
    totalPoints: document.getElementById('total-points'),
    potAmount: document.getElementById('pot-amount'),
    potContainer: document.querySelector('.pot-container'),
    heatFill: document.getElementById('heat-fill'),
    streakIndicator: document.getElementById('streak-indicator'),
    questionCategory: document.getElementById('question-category'),
    questionText: document.getElementById('question-text'),
    answersContainer: document.getElementById('answers-container'),
    btnBank: document.getElementById('btn-bank'),

    // Result overlay
    resultOverlay: document.getElementById('result-overlay'),
    resultIcon: document.getElementById('result-icon'),
    resultText: document.getElementById('result-text'),
    resultPoints: document.getElementById('result-points'),
    btnContinue: document.getElementById('btn-continue'),

    // Game over screen
    finalResults: document.getElementById('final-results'),
    highscoreMessage: document.getElementById('highscore-message'),
    btnPlayAgain: document.getElementById('btn-play-again'),
    btnMainMenu: document.getElementById('btn-main-menu'),

    // Highscore screen
    highscoreList: document.getElementById('highscore-list'),
    btnBackHighscore: document.getElementById('btn-back-highscore'),

    // Rules screen
    btnBackRules: document.getElementById('btn-back-rules')
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
            console.log('Web Audio API not supported');
        }
    },

    playTone(frequency, duration, type = 'sine') {
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
        this.playTone(523.25, 0.1); // C5
        setTimeout(() => this.playTone(659.25, 0.1), 100); // E5
        setTimeout(() => this.playTone(783.99, 0.15), 200); // G5
    },

    wrong() {
        this.playTone(200, 0.3, 'sawtooth');
        setTimeout(() => this.playTone(150, 0.4, 'sawtooth'), 150);
    },

    bank() {
        this.playTone(440, 0.1);
        setTimeout(() => this.playTone(554.37, 0.1), 80);
        setTimeout(() => this.playTone(659.25, 0.1), 160);
        setTimeout(() => this.playTone(880, 0.2), 240);
    },

    click() {
        this.playTone(800, 0.05);
    },

    gameOver() {
        const notes = [523.25, 493.88, 440, 392, 349.23, 329.63, 293.66, 261.63];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.15), i * 150);
        });
    },

    victory() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((note, i) => {
            setTimeout(() => this.playTone(note, 0.2), i * 150);
        });
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showScreen(screenName) {
    Object.values(DOM.screens).forEach(screen => {
        screen.classList.remove('active');
    });
    DOM.screens[screenName].classList.add('active');
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
    return num.toLocaleString('sv-SE');
}

function animateNumber(element, start, end, duration = 500) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);

        element.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ============================================
// HIGHSCORE SYSTEM
// ============================================

const HighscoreSystem = {
    KEY: 'satsa_highscores',
    MAX_ENTRIES: 10,

    getScores() {
        try {
            const data = localStorage.getItem(this.KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    saveScore(name, score) {
        const scores = this.getScores();
        const newEntry = {
            name,
            score,
            date: new Date().toLocaleDateString('sv-SE')
        };

        scores.push(newEntry);
        scores.sort((a, b) => b.score - a.score);
        scores.splice(this.MAX_ENTRIES);

        try {
            localStorage.setItem(this.KEY, JSON.stringify(scores));
        } catch (e) {
            console.log('Could not save highscore');
        }

        return scores.findIndex(s => s.name === name && s.score === score && s.date === newEntry.date) + 1;
    },

    isHighscore(score) {
        const scores = this.getScores();
        if (scores.length < this.MAX_ENTRIES) return true;
        return score > scores[scores.length - 1].score;
    },

    render() {
        const scores = this.getScores();

        if (scores.length === 0) {
            DOM.highscoreList.innerHTML = '<p class="no-scores">Inga poäng ännu. Spela för att komma på listan!</p>';
            return;
        }

        DOM.highscoreList.innerHTML = scores.map((entry, index) => `
            <div class="highscore-item">
                <span class="position">${index + 1}.</span>
                <span class="name">${entry.name}</span>
                <span class="score">${formatNumber(entry.score)}</span>
                <span class="date">${entry.date}</span>
            </div>
        `).join('');
    }
};

// ============================================
// GAME LOGIC
// ============================================

function resetGameState() {
    GameState.currentRound = 1;
    GameState.pot = 0;
    GameState.streak = 0;
    GameState.questionsAnswered = 0;
    GameState.usedQuestionIndices.clear();
    GameState.currentPlayerIndex = 0;
    GameState.gameOver = false;

    GameState.players.forEach(player => {
        player.score = 0;
    });
}

function getCurrentPlayer() {
    return GameState.players[GameState.currentPlayerIndex];
}

function getRandomQuestion() {
    const questions = QUESTIONS[GameState.category];
    const availableIndices = [];

    for (let i = 0; i < questions.length; i++) {
        if (!GameState.usedQuestionIndices.has(i)) {
            availableIndices.push(i);
        }
    }

    // If all questions used, reset
    if (availableIndices.length === 0) {
        GameState.usedQuestionIndices.clear();
        for (let i = 0; i < questions.length; i++) {
            availableIndices.push(i);
        }
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    GameState.usedQuestionIndices.add(randomIndex);

    return { ...questions[randomIndex], index: randomIndex };
}

function calculatePotValue() {
    if (GameState.streak === 0) return 100;
    return 100 * Math.pow(2, GameState.streak);
}

function updateUI() {
    const player = getCurrentPlayer();

    // Update header
    DOM.currentRound.textContent = GameState.currentRound;
    DOM.totalRounds.textContent = GameState.totalRounds;
    DOM.currentPlayerName.textContent = player.name;
    DOM.totalPoints.textContent = formatNumber(player.score);

    // Update pot
    DOM.potAmount.textContent = formatNumber(GameState.pot);

    // Update heat meter (0-100% based on pot value, max at 6400)
    const heatPercent = Math.min((GameState.pot / 6400) * 100, 100);
    DOM.heatFill.style.width = `${heatPercent}%`;

    // Update pot container styling based on heat
    DOM.potContainer.classList.remove('hot', 'burning');
    if (GameState.pot >= 800) {
        DOM.potContainer.classList.add('burning');
    } else if (GameState.pot >= 400) {
        DOM.potContainer.classList.add('hot');
    }

    // Update streak indicator
    updateStreakIndicator();

    // Update bank button
    DOM.btnBank.disabled = GameState.pot === 0;
}

function updateStreakIndicator() {
    const maxDots = 7;
    let html = '';

    for (let i = 0; i < maxDots; i++) {
        const isActive = i < GameState.streak;
        html += `<div class="streak-dot ${isActive ? 'active' : ''}"></div>`;
    }

    DOM.streakIndicator.innerHTML = html;
}

function displayQuestion() {
    const question = getRandomQuestion();
    GameState.currentQuestion = question;

    // Get category for display
    const categoryKey = question.category || GameState.category;
    DOM.questionCategory.textContent = `${CATEGORY_ICONS[categoryKey]} ${CATEGORY_NAMES[categoryKey]}`;

    // Display question
    DOM.questionText.textContent = question.question;

    // Shuffle answers but track correct answer
    const answerIndices = [0, 1, 2, 3];
    const shuffledIndices = shuffleArray(answerIndices);

    DOM.answersContainer.innerHTML = shuffledIndices.map((originalIndex, displayIndex) => `
        <button class="answer-btn" data-original-index="${originalIndex}">
            ${question.answers[originalIndex]}
        </button>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', handleAnswer);
    });
}

function handleAnswer(e) {
    const selectedIndex = parseInt(e.target.dataset.originalIndex);
    const correctIndex = GameState.currentQuestion.correct;
    const isCorrect = selectedIndex === correctIndex;

    // Disable all answer buttons
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
        btn.removeEventListener('click', handleAnswer);

        const btnIndex = parseInt(btn.dataset.originalIndex);
        if (btnIndex === correctIndex) {
            btn.classList.add('correct');
        } else if (btnIndex === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    AudioSystem.correct();

    // Calculate new pot value
    const potIncrease = calculatePotValue();
    GameState.pot += potIncrease;
    GameState.streak++;

    // Animate pot
    DOM.potAmount.classList.add('pop');
    setTimeout(() => DOM.potAmount.classList.remove('pop'), 300);

    // Update UI
    updateUI();

    // Show result
    showResult('correct', potIncrease);
}

function handleWrongAnswer() {
    AudioSystem.wrong();

    const lostPoints = GameState.pot;
    GameState.pot = 0;
    GameState.streak = 0;

    // Shake animation
    DOM.potContainer.classList.add('shake');
    setTimeout(() => DOM.potContainer.classList.remove('shake'), 500);

    updateUI();

    // Show result and end round
    showResult('wrong', lostPoints);
}

function handleBank() {
    AudioSystem.bank();

    const bankedPoints = GameState.pot;
    getCurrentPlayer().score += bankedPoints;
    GameState.pot = 0;
    GameState.streak = 0;

    updateUI();

    showResult('banked', bankedPoints);
}

function showResult(type, points) {
    DOM.resultOverlay.classList.remove('hidden');

    switch (type) {
        case 'correct':
            DOM.resultIcon.textContent = '✓';
            DOM.resultText.textContent = 'RÄTT!';
            DOM.resultText.className = 'result-text correct';
            DOM.resultPoints.textContent = `+${formatNumber(points)} i potten`;
            DOM.btnContinue.textContent = GameState.pot >= 6400 ? 'Banka automatiskt' : 'Nästa fråga';
            break;
        case 'wrong':
            DOM.resultIcon.textContent = '✗';
            DOM.resultText.textContent = 'FEL!';
            DOM.resultText.className = 'result-text wrong';
            DOM.resultPoints.textContent = points > 0 ? `-${formatNumber(points)} förlorat` : 'Inga poäng förlorade';
            DOM.btnContinue.textContent = 'Fortsätt';
            break;
        case 'banked':
            DOM.resultIcon.textContent = '💰';
            DOM.resultText.textContent = 'BANKAT!';
            DOM.resultText.className = 'result-text banked';
            DOM.resultPoints.textContent = `+${formatNumber(points)} säkrade`;
            DOM.btnContinue.textContent = 'Fortsätt';
            break;
    }
}

function continueGame() {
    DOM.resultOverlay.classList.add('hidden');

    // Check if we should auto-bank (pot >= 6400)
    if (GameState.pot >= 6400) {
        handleBank();
        return;
    }

    // If pot is 0 (wrong answer or banked), move to next round/player
    if (GameState.pot === 0) {
        nextTurn();
    } else {
        // Continue with another question in the same round
        displayQuestion();
    }
}

function nextTurn() {
    // In multiplayer, switch to next player
    if (GameState.isMultiplayer) {
        GameState.currentPlayerIndex++;

        // If all players have had their turn, advance round
        if (GameState.currentPlayerIndex >= GameState.players.length) {
            GameState.currentPlayerIndex = 0;
            GameState.currentRound++;
        }
    } else {
        GameState.currentRound++;
    }

    // Check if game is over
    if (GameState.currentRound > GameState.totalRounds) {
        endGame();
        return;
    }

    // Reset round state
    GameState.pot = 0;
    GameState.streak = 0;

    updateUI();
    displayQuestion();
}

function endGame() {
    GameState.gameOver = true;

    // Sort players by score
    const sortedPlayers = [...GameState.players].sort((a, b) => b.score - a.score);

    // Check for highscore (solo mode)
    let isNewHighscore = false;
    if (!GameState.isMultiplayer && sortedPlayers[0].score > 0) {
        isNewHighscore = HighscoreSystem.isHighscore(sortedPlayers[0].score);
        if (isNewHighscore) {
            HighscoreSystem.saveScore(sortedPlayers[0].name, sortedPlayers[0].score);
            AudioSystem.victory();
        } else {
            AudioSystem.gameOver();
        }
    } else {
        AudioSystem.victory();
    }

    // Render results
    DOM.finalResults.innerHTML = sortedPlayers.map((player, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        const isWinner = index === 0 && (GameState.isMultiplayer || player.score > 0);

        return `
            <div class="final-result-item ${isWinner ? 'winner' : ''}">
                <span class="rank ${rankClass}">${index + 1}.</span>
                <span class="player-name">${player.name}</span>
                <span class="final-score">${formatNumber(player.score)}</span>
            </div>
        `;
    }).join('');

    // Show highscore message
    if (isNewHighscore) {
        DOM.highscoreMessage.classList.remove('hidden');
    } else {
        DOM.highscoreMessage.classList.add('hidden');
    }

    showScreen('gameover');
}

// ============================================
// SETUP FUNCTIONS
// ============================================

function setupPlayerInputs(count) {
    DOM.playerInputs.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'player-input-group';
        div.innerHTML = `
            <label>Spelare ${i + 1}</label>
            <input type="text" class="player-name-input" placeholder="Namn" maxlength="15">
        `;
        DOM.playerInputs.appendChild(div);
    }

    updateAddPlayerButton();
}

function updateAddPlayerButton() {
    const currentCount = DOM.playerInputs.querySelectorAll('.player-input-group').length;
    DOM.btnAddPlayer.disabled = currentCount >= 4;
    DOM.btnAddPlayer.style.display = GameState.isMultiplayer ? 'block' : 'none';
}

function addPlayer() {
    const currentCount = DOM.playerInputs.querySelectorAll('.player-input-group').length;
    if (currentCount >= 4) return;

    const div = document.createElement('div');
    div.className = 'player-input-group';
    div.innerHTML = `
        <label>Spelare ${currentCount + 1}</label>
        <input type="text" class="player-name-input" placeholder="Namn" maxlength="15">
    `;
    DOM.playerInputs.appendChild(div);

    updateAddPlayerButton();
    AudioSystem.click();
}

function selectCategory(e) {
    const btn = e.target.closest('.category-btn');
    if (!btn) return;

    DOM.categoryButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    GameState.category = btn.dataset.category;
    AudioSystem.click();
}

function validateSetup() {
    const inputs = DOM.playerInputs.querySelectorAll('.player-name-input');
    const names = Array.from(inputs).map(input => input.value.trim());

    // Check that all players have names
    const allNamed = names.every(name => name.length > 0);

    // Check that a category is selected
    const categorySelected = document.querySelector('.category-btn.selected');

    return allNamed && categorySelected;
}

function startGame() {
    if (!validateSetup()) {
        // Flash the start button or show error
        DOM.btnStartGame.classList.add('shake');
        setTimeout(() => DOM.btnStartGame.classList.remove('shake'), 500);
        return;
    }

    // Get player names
    const inputs = DOM.playerInputs.querySelectorAll('.player-name-input');
    GameState.players = Array.from(inputs).map(input => ({
        name: input.value.trim(),
        score: 0
    }));

    // Reset game state
    resetGameState();

    // Update UI
    updateUI();

    // Show game screen
    showScreen('game');

    // Display first question
    displayQuestion();

    AudioSystem.click();
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    // Start screen
    DOM.btnSolo.addEventListener('click', () => {
        GameState.isMultiplayer = false;
        setupPlayerInputs(1);
        showScreen('setup');
        AudioSystem.click();
    });

    DOM.btnMultiplayer.addEventListener('click', () => {
        GameState.isMultiplayer = true;
        setupPlayerInputs(2);
        showScreen('setup');
        AudioSystem.click();
    });

    DOM.btnHighscore.addEventListener('click', () => {
        HighscoreSystem.render();
        showScreen('highscore');
        AudioSystem.click();
    });

    DOM.btnRules.addEventListener('click', () => {
        showScreen('rules');
        AudioSystem.click();
    });

    // Setup screen
    DOM.btnAddPlayer.addEventListener('click', addPlayer);
    DOM.categoryButtons.forEach(btn => {
        btn.addEventListener('click', selectCategory);
    });
    DOM.btnBackSetup.addEventListener('click', () => {
        showScreen('start');
        AudioSystem.click();
    });
    DOM.btnStartGame.addEventListener('click', startGame);

    // Game screen
    DOM.btnBank.addEventListener('click', handleBank);
    DOM.btnContinue.addEventListener('click', continueGame);

    // Game over screen
    DOM.btnPlayAgain.addEventListener('click', () => {
        resetGameState();
        updateUI();
        showScreen('game');
        displayQuestion();
        AudioSystem.click();
    });

    DOM.btnMainMenu.addEventListener('click', () => {
        showScreen('start');
        AudioSystem.click();
    });

    // Highscore screen
    DOM.btnBackHighscore.addEventListener('click', () => {
        showScreen('start');
        AudioSystem.click();
    });

    // Rules screen
    DOM.btnBackRules.addEventListener('click', () => {
        showScreen('start');
        AudioSystem.click();
    });

    // Initialize audio on first user interaction
    document.addEventListener('click', () => {
        if (!AudioSystem.context) {
            AudioSystem.init();
        }
    }, { once: true });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Select default category
    document.querySelector('.category-btn[data-category="mixed"]').classList.add('selected');

    // Initialize event listeners
    initEventListeners();

    // Show start screen
    showScreen('start');

    console.log('🎲 SATSA initialized!');
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
