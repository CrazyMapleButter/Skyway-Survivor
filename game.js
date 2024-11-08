const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const gameContainer = document.getElementById('game-container');
const mainMenu = document.getElementById('main-menu');
const creditsModal = document.getElementById('credits-modal');
const settingsModal = document.getElementById('settings-modal');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const retryBtn = document.getElementById('retry-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const closeCreditsBtn = document.getElementById('close-credits-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const startGameBtn = document.getElementById('start-game-btn');
const settingsBtn = document.getElementById('settings-btn');
const creditsBtn = document.getElementById('credits-btn');
const toggleScoreDisplay = document.getElementById('toggle-score-display');

let playerPosition;
let playerSpeed;
let score;
let scoreIncrement;
let obstacles;
let gameOver;
let obstacleSpeed;
let spawnRate;
let lastObstacleTime;
let scoreThreshold;
let initialObstacleCount;
let additionalObstaclesPerSpawn;

let isMovingLeft = false;
let isMovingRight = false;

function resetGameState() {
    playerPosition = window.innerWidth / 2 - 25;
    playerSpeed = 5;
    score = 0;
    scoreIncrement = 0.1;
    obstacles = [];
    gameOver = false;
    obstacleSpeed = 3;
    spawnRate = 600;
    lastObstacleTime = 0;
    scoreThreshold = 10;
    initialObstacleCount = 5;
    additionalObstaclesPerSpawn = 2;
    isMovingLeft = false;
    isMovingRight = false;

    const allObstacles = document.querySelectorAll('.obstacle');
    allObstacles.forEach(obstacle => obstacle.remove());
    player.style.left = playerPosition + 'px';
    scoreDisplay.textContent = 'Score: 0';
}

function showMainMenu() {
    mainMenu.style.display = 'flex';
    gameContainer.style.display = 'none';
    gameOverScreen.style.display = 'none';
    creditsModal.style.display = 'none';
    settingsModal.style.display = 'none';
    scoreDisplay.style.display = 'none';
}

function showCredits() {
    creditsModal.style.display = 'block';
    mainMenu.style.display = 'none';
}

function showSettings() {
    settingsModal.style.display = 'block';
    mainMenu.style.display = 'none';
}

function showGame() {
    resetGameState();
    gameContainer.style.display = 'block';
    mainMenu.style.display = 'none';
    gameOverScreen.style.display = 'none';
    scoreDisplay.style.display = 'block';
    startGame();
}

function showGameOver() {
    gameOverScreen.style.display = 'block';
    gameContainer.style.display = 'none';
    finalScoreDisplay.textContent = Math.floor(score);
}

function startGame() {
    if (!gameOver) {
        for (let i = 0; i < initialObstacleCount; i++) {
            generateObstacle();
        }

        requestAnimationFrame(gameLoop);
    }
}

function generateObstacle() {
    if (gameOver) return;

    const obstacleWidth = Math.floor(Math.random() * 60) + 20;
    const obstacleLeft = Math.floor(Math.random() * (gameContainer.clientWidth - obstacleWidth));
    const obstacle = document.createElement('div');

    obstacle.classList.add('obstacle');
    obstacle.style.width = `${obstacleWidth}px`;
    obstacle.style.height = '30px';
    obstacle.style.position = 'absolute';
    obstacle.style.top = '0px';
    obstacle.style.left = `${obstacleLeft}px`;

    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

function movePlayer() {
    if (gameOver) return;

    if (isMovingLeft && playerPosition > 0) {
        playerPosition -= playerSpeed;
    }
    if (isMovingRight && playerPosition < gameContainer.clientWidth - 50) {
        playerPosition += playerSpeed;
    }

    player.style.left = playerPosition + 'px';
}

function moveObstacles() {
    if (gameOver) return;

    const playerRect = player.getBoundingClientRect();

    let offScreenOffset = 100;

    if (Math.floor(score) >= 800) {
        offScreenOffset = 200;
    }

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        const topPosition = parseInt(obstacle.style.top, 10) + obstacleSpeed;
        obstacle.style.top = topPosition + 'px';

        const obstacleBottom = topPosition + parseInt(obstacle.style.height, 10);

        if (obstacleBottom > gameContainer.clientHeight + offScreenOffset) {
            obstacles.splice(i, 1);
            obstacle.remove();
            i--;
            continue;
        }

        const obstacleRect = obstacle.getBoundingClientRect();
        if (
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ) {
            gameOver = true;
            showGameOver();
            break;
        }
    }
}

function increaseDifficulty() {
    if (gameOver) return;

    if (Math.floor(score) >= scoreThreshold) {
        obstacleSpeed += 0.05;
        spawnRate = Math.max(400, spawnRate - 10);
        scoreThreshold += 10;
    }
}

function gameLoop() {
    if (gameOver) return;

    movePlayer();
    moveObstacles();
    increaseDifficulty();

    score += scoreIncrement;

    if (toggleScoreDisplay.checked) {
        scoreDisplay.textContent = `Score: ${Math.floor(score)}`;
        scoreDisplay.style.display = 'block';
    } else {
        scoreDisplay.style.display = 'none';
    }

    const currentTime = Date.now();
    if (currentTime - lastObstacleTime > spawnRate) {
        for (let i = 0; i < additionalObstaclesPerSpawn; i++) {
            generateObstacle();
        }
        lastObstacleTime = currentTime;
    }

    requestAnimationFrame(gameLoop);
}

startGameBtn.addEventListener('click', showGame);
creditsBtn.addEventListener('click', showCredits);
settingsBtn.addEventListener('click', showSettings);
closeCreditsBtn.addEventListener('click', showMainMenu);
closeSettingsBtn.addEventListener('click', showMainMenu);
retryBtn.addEventListener('click', () => {
    resetGameState();
    showGame();
});
backToMenuBtn.addEventListener('click', showMainMenu);

document.addEventListener('keydown', (event) => {
    if (gameOver) return;

    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        isMovingLeft = true;
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        isMovingRight = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        isMovingLeft = false;
    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        isMovingRight = false;
    }
});

showMainMenu();
