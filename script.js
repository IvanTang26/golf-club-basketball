// Get DOM elements
const startBtn = document.getElementById('startBtn');
const shootBtn = document.getElementById('shootBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const countdownDisplay = document.getElementById('countdown');
const gameOverDisplay = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const sensorIndicator = document.getElementById('sensorIndicator');

// Get audio elements
const countdownSound = document.getElementById('countdownSound');
const scoreSound = document.getElementById('scoreSound');
const gameOverSound = document.getElementById('gameOverSound');

// Game variables
let score = 0;
let timeLeft = 60;
let gameInterval;
let isGameRunning = false;
let sensorActive = false;
let lastSensorTriggerTime = 0;

// Constants
const SCORE_PROBABILITY = 0.7;
const POINTS_PER_BASKET = 2;
const SENSOR_COOLDOWN = 1000; // 1 second cooldown between sensor triggers
const TTL_HIGH = 1;
const TTL_LOW = 0;

// Simulate TTL sensor input
function simulateTTLSensor() {
    if (!isGameRunning) return;
    
    const now = Date.now();
    if (now - lastSensorTriggerTime < SENSOR_COOLDOWN) return;
    
    // Simulate sensor detection (TTL HIGH)
    sensorActive = true;
    sensorIndicator.classList.add('active');
    lastSensorTriggerTime = now;
    
    // Process the score
    processScore();
    
    // Simulate sensor reset (TTL LOW) after 100ms
    setTimeout(() => {
        sensorActive = false;
        sensorIndicator.classList.remove('active');
    }, 100);
}

// Start game function
function startGame() {
    if (isGameRunning) return;
    
    // Reset game state
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    gameOverDisplay.classList.add('hidden');
    sensorIndicator.classList.remove('active');
    
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

// Process score function (used by both manual and TTL input)
function processScore() {
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

// Manual shoot function
function shoot() {
    if (!isGameRunning) return;
    processScore();
}

// End game function
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    shootBtn.disabled = true;
    startBtn.disabled = false;
    sensorIndicator.classList.remove('active');
    
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
            simulateTTLSensor(); // Use space bar to simulate sensor input
        }
    }
}); 