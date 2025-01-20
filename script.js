// Get DOM elements
const startBtn = document.getElementById('startBtn');
const shootBtn = document.getElementById('shootBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const countdownDisplay = document.getElementById('countdown');
const gameOverDisplay = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');

// Get audio elements
const countdownSound = document.getElementById('countdownSound');
const scoreSound = document.getElementById('scoreSound');
const gameOverSound = document.getElementById('gameOverSound');

// Game variables
let score = 0;
let timeLeft = 60;
let gameInterval;
let isGameRunning = false;

// Probability of scoring (70% chance)
const SCORE_PROBABILITY = 0.7;
const POINTS_PER_BASKET = 2;

// Start game function
function startGame() {
    if (isGameRunning) return;
    
    // Reset game state
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    gameOverDisplay.classList.add('hidden');
    
    // Start countdown
    startCountdown();
}

// Countdown function
function startCountdown() {
    countdownDisplay.classList.remove('hidden');
    countdownDisplay.classList.add('active');
    let count = 3;
    
    countdownSound.currentTime = 0;
    countdownSound.play();
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownDisplay.textContent = count;
        } else if (count === 0) {
            countdownDisplay.textContent = 'GO!';
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.classList.remove('active');
            countdownDisplay.classList.add('hidden');
            startGameplay();
        }
    }, 1000);
}

// Start actual gameplay
function startGameplay() {
    isGameRunning = true;
    startBtn.disabled = true;
    shootBtn.disabled = false;
    
    gameInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Shoot function
function shoot() {
    if (!isGameRunning) return;
    
    if (Math.random() < SCORE_PROBABILITY) {
        score += POINTS_PER_BASKET;
        scoreDisplay.textContent = score;
        scoreSound.currentTime = 0;
        scoreSound.play();
        
        // Visual feedback for scoring
        scoreDisplay.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scoreDisplay.style.transform = 'scale(1)';
        }, 200);
    }
}

// End game function
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    shootBtn.disabled = true;
    startBtn.disabled = false;
    
    gameOverSound.play();
    
    finalScoreDisplay.textContent = score;
    gameOverDisplay.classList.remove('hidden');
}

// Event listeners
startBtn.addEventListener('click', startGame);
shootBtn.addEventListener('click', shoot);
restartBtn.addEventListener('click', startGame);

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!isGameRunning) {
            startGame();
        } else {
            shoot();
        }
    }
}); 