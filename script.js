// Игровые переменные
let targetNumber;
let attemptsLeft;
let extraAttemptsUsed = false;

// Получаем элементы DOM
const elements = {
    mainMenu: document.getElementById('main-menu'),
    gameScreen: document.getElementById('game-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    playButton: document.getElementById('play-button'),
    grid: document.getElementById('grid'),
    attemptsDisplay: document.getElementById('attempts'),
    feedback: document.getElementById('feedback'),
    extraAttemptsButton: document.getElementById('extra-attempts'),
    mainMenuButton: document.getElementById('main-menu-button'),
    tryAgainButton: document.getElementById('try-again-button'),
    gameOverMessage: document.getElementById('game-over-message')
};

// Инициализация OK SDK
function initOKSDK() {
    return new Promise((resolve) => {
        if (typeof OKSDK !== 'undefined') {
            OKSDK.init({
                appId: '512002430595',  // Замените на реальный ID
                appKey: 'CEIHBKLGDIHBABABA'  // Замените на реальный ключ
            });
            console.log('OK SDK успешно инициализирован');
            resolve(true);
        } else {
            console.warn('OK SDK не загрузился. Игра будет работать без рекламы');
            resolve(false);
        }
    });
}

// Показать рекламу перед игрой
function showAd(callback) {
    if (typeof OKSDK !== 'undefined' && OKSDK.Advert) {
        OKSDK.Advert.showFullscreen({
            onClose: () => callback(),
            onError: () => callback()
        });
    } else {
        callback();
    }
}

// Основные игровые функции
function startGame() {
    targetNumber = Math.floor(Math.random() * 81) + 1;
    attemptsLeft = 5;
    extraAttemptsUsed = false;
    elements.attemptsDisplay.textContent = attemptsLeft;
    elements.feedback.textContent = '';
    elements.extraAttemptsButton.classList.add('hidden');
    generateGrid();
    showScreen(elements.gameScreen);
}

function generateGrid() {
    elements.grid.innerHTML = '';
    for (let i = 1; i <= 81; i++) {
        const cell = document.createElement('div');
        cell.textContent = i;
        cell.addEventListener('click', () => handleGuess(i));
        elements.grid.appendChild(cell);
    }
}

function handleGuess(number) {
    if (number === targetNumber) {
        elements.feedback.textContent = 'УГАДАЛИ!';
        endGame(true);
    } else {
        elements.feedback.textContent = number < targetNumber ? 'БОЛЬШЕ!' : 'МЕНЬШЕ!';
        attemptsLeft--;
        elements.attemptsDisplay.textContent = attemptsLeft;
        if (attemptsLeft === 0) {
            endGame(false);
        } else if (attemptsLeft === 1 && !extraAttemptsUsed) {
            elements.extraAttemptsButton.classList.remove('hidden');
        }
    }
}

function endGame(won) {
    elements.gameOverMessage.textContent = won 
        ? 'Поздравляем, вы угадали загаданное число!' 
        : 'Не угадали, в следующий раз повезет!';
    showScreen(elements.gameOverScreen);
}

function showScreen(screen) {
    elements.mainMenu.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.gameOverScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

// Добавление дополнительных попыток
function addExtraAttempts() {
    attemptsLeft += 3;
    elements.attemptsDisplay.textContent = attemptsLeft;
    elements.extraAttemptsButton.classList.add('hidden');
    extraAttemptsUsed = true;
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    // Настройка обработчиков событий
    elements.playButton.addEventListener('click', () => showAd(startGame));
    elements.tryAgainButton.addEventListener('click', () => showAd(startGame));
    elements.mainMenuButton.addEventListener('click', () => showScreen(elements.mainMenu));
    elements.extraAttemptsButton.addEventListener('click', addExtraAttempts);

    // Инициализация SDK и запуск игры
    initOKSDK().then(() => {
        showScreen(elements.mainMenu);
    });
});