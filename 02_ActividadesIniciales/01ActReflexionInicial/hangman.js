const words = [
    {
        word: "RELACIONAL",
        hint: "Tipo más común de base de datos basado en tablas"
    },
    {
        word: "ENTIDAD",
        hint: "Objeto o concepto del mundo real que se representa en la base de datos"
    },
    {
        word: "ATRIBUTO",
        hint: "Característica o propiedad que describe una entidad"
    },
    {
        word: "NORMALIZACION",
        hint: "Proceso para eliminar la redundancia de datos"
    },
    {
        word: "REDUNDANCIA",
        hint: "Repetición innecesaria de datos en una base de datos"
    },
    {
        word: "INTEGRIDAD",
        hint: "Precisión y consistencia de los datos a lo largo del tiempo"
    },
    {
        word: "CARDINALIDAD",
        hint: "Número de instancias de una entidad que pueden estar relacionadas con otra"
    },
    {
        word: "TRANSACCION",
        hint: "Conjunto de operaciones que se ejecutan como una unidad"
    },
    {
        word: "INDEXACION",
        hint: "Método para optimizar la recuperación de registros"
    },
    {
        word: "PERSISTENCIA",
        hint: "Capacidad de los datos para sobrevivir después de que el programa termina"
    }
];

let currentWordIndex = 0;
let score = 0;
let timeLeft = 15 * 60; // 15 minutos en segundos
let currentWord = "";
let guessedLetters = new Set();
let remainingAttempts = 6;
let timerInterval;

function initializeGame() {
    currentWordIndex = 0;
    score = 0;
    startNewWord();
    startTimer();
    updateScore();
    createKeyboard();
}

function startNewWord() {
    if (currentWordIndex >= words.length) {
        showFinalResults();
        return;
    }

    currentWord = words[currentWordIndex].word;
    document.getElementById('hint').textContent = words[currentWordIndex].hint;
    document.getElementById('current-word').textContent = currentWordIndex + 1;
    guessedLetters = new Set();
    remainingAttempts = 6;
    updateWordDisplay();
    updateAttempts();
    resetHangman();
    enableAllButtons();
    hideMessage();
    document.getElementById('next-section').classList.add('d-none');
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'btn btn-outline-primary letter-button';
        button.onclick = () => guessLetter(letter);
        keyboard.appendChild(button);
    });
}

function guessLetter(letter) {
    if (guessedLetters.has(letter)) return;

    guessedLetters.add(letter);
    const button = Array.from(document.getElementsByClassName('letter-button'))
        .find(btn => btn.textContent === letter);
    button.disabled = true;

    if (!currentWord.includes(letter)) {
        remainingAttempts--;
        updateHangman();
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-danger');
    } else {
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-success');
    }

    updateWordDisplay();
    updateAttempts();
    checkGameStatus();
}

function updateWordDisplay() {
    const display = currentWord
        .split('')
        .map(letter => guessedLetters.has(letter) ? letter : '_')
        .join(' ');
    document.getElementById('word-display').textContent = display;
}

function updateAttempts() {
    document.getElementById('attempts').textContent = remainingAttempts;
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function checkGameStatus() {
    const wordCompleted = currentWord
        .split('')
        .every(letter => guessedLetters.has(letter));

    if (wordCompleted) {
        showMessage('¡Correcto! Has adivinado la palabra.', 'success');
        score++;
        updateScore();
        showNextButton();
    } else if (remainingAttempts === 0) {
        showMessage(`¡Game Over! La palabra era: ${currentWord}`, 'danger');
        showNextButton();
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `alert alert-${type} text-center mb-4`;
    messageDiv.classList.remove('d-none');
}

function hideMessage() {
    document.getElementById('message').classList.add('d-none');
}

function showNextButton() {
    document.getElementById('next-section').classList.remove('d-none');
    disableAllButtons();
}

function enableAllButtons() {
    const buttons = document.getElementsByClassName('letter-button');
    Array.from(buttons).forEach(button => {
        button.disabled = false;
        button.classList.remove('btn-danger', 'btn-success');
        button.classList.add('btn-outline-primary');
    });
}

function disableAllButtons() {
    const buttons = document.getElementsByClassName('letter-button');
    Array.from(buttons).forEach(button => button.disabled = true);
}

function updateHangman() {
    const parts = document.querySelector('#hangman').children;
    const partsToShow = 10 - remainingAttempts;
    for (let i = 0; i < parts.length; i++) {
        parts[i].classList.toggle('d-none', i >= partsToShow);
    }
}

function resetHangman() {
    const parts = document.querySelector('#hangman').children;
    Array.from(parts).forEach(part => part.classList.add('d-none'));
    parts[0].classList.remove('d-none'); // Mostrar solo la base
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const progressBar = document.querySelector('.progress-bar');
        const percentage = (timeLeft / (15 * 60)) * 100;
        progressBar.style.width = `${percentage}%`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showFinalResults();
        }
    }, 1000);
}

function showFinalResults() {
    document.getElementById('keyboard').classList.add('d-none');
    document.getElementById('next-section').classList.add('d-none');
    document.getElementById('final-results').classList.remove('d-none');
    document.getElementById('final-score').textContent = score;
    clearInterval(timerInterval);
}

// Event Listeners
document.getElementById('next-word').addEventListener('click', () => {
    currentWordIndex++;
    startNewWord();
});

document.getElementById('restart-game').addEventListener('click', () => {
    document.getElementById('keyboard').classList.remove('d-none');
    document.getElementById('final-results').classList.add('d-none');
    timeLeft = 15 * 60;
    initializeGame();
});

// Iniciar el juego
initializeGame();