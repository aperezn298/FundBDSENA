const questions = [
    {
        question: "¿Qué es una base de datos?",
        options: [
            "Un conjunto de archivos sin relación",
            "Una colección organizada de datos estructurados",
            "Un programa de computadora",
            "Un sistema operativo"
        ],
        correct: 1
    },
    {
        question: "¿Cuál es la unidad más básica de almacenamiento en una base de datos?",
        options: [
            "Tabla",
            "Registro",
            "Campo",
            "Byte"
        ],
        correct: 2
    },
    {
        question: "¿Qué es un DBMS?",
        options: [
            "Un tipo de base de datos",
            "Un lenguaje de programación",
            "Un sistema para gestionar bases de datos",
            "Un formato de archivo"
        ],
        correct: 2
    },
    {
        question: "¿Cuál es la principal ventaja de usar una base de datos?",
        options: [
            "Ocupa menos espacio en disco",
            "Es más rápida que usar archivos",
            "Reduce la redundancia y mantiene la integridad de los datos",
            "Es más fácil de programar"
        ],
        correct: 2
    },
    {
        question: "¿Qué es la integridad referencial?",
        options: [
            "Un tipo de virus informático",
            "Una regla que asegura la consistencia entre datos relacionados",
            "Un método de compresión de datos",
            "Un tipo de respaldo"
        ],
        correct: 1
    },
    {
        question: "¿Qué es un modelo entidad-relación?",
        options: [
            "Un tipo de base de datos",
            "Una herramienta de diagrama para diseñar bases de datos",
            "Un lenguaje de programación",
            "Un sistema operativo"
        ],
        correct: 1
    },
    {
        question: "¿Qué es la normalización en bases de datos?",
        options: [
            "Comprimir los datos",
            "Proceso de organizar datos para reducir la redundancia",
            "Convertir datos a formato digital",
            "Eliminar datos duplicados"
        ],
        correct: 1
    },
    {
        question: "¿Qué es una clave primaria?",
        options: [
            "La primera columna de una tabla",
            "Un campo que identifica de manera única cada registro",
            "Una contraseña de acceso",
            "El nombre de la base de datos"
        ],
        correct: 1
    },
    {
        question: "¿Qué es la cardinalidad en bases de datos?",
        options: [
            "El número total de tablas",
            "La relación numérica entre entidades relacionadas",
            "El tamaño de la base de datos",
            "El número de usuarios"
        ],
        correct: 1
    },
    {
        question: "¿Cuál es el propósito de un índice en una base de datos?",
        options: [
            "Ordenar los datos alfabéticamente",
            "Acelerar la búsqueda y recuperación de datos",
            "Comprimir los datos",
            "Proteger los datos con contraseña"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;

const EXAM_DURATION = 30 * 60; // 30 minutos en segundos
let timeLeft = EXAM_DURATION;
let timerInterval;

const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const resultsDiv = document.getElementById('results');
const scoreSpan = document.getElementById('current-score');
const timeSpan = document.getElementById('time');
const restartButton = document.getElementById('restart-btn');

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const progressBar = document.querySelector('.progress-bar');
        const percentage = (timeLeft / EXAM_DURATION) * 100; // Usando la constante
        progressBar.style.width = `${percentage}%`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showResults();
        }
    }, 1000);
}

function displayQuestion() {
    const question = questions[currentQuestion];
    questionContainer.innerHTML = `
        <h5 class="mb-3">Pregunta ${currentQuestion + 1} de ${questions.length}</h5>
        <p class="mb-4">${question.question}</p>
        <div class="options">
            ${question.options.map((option, index) => `
                <div class="form-check mb-3">
                    <input class="form-check-input" type="radio" name="answer" value="${index}" id="option${index}">
                    <label class="form-check-label" for="option${index}">
                        ${option}
                    </label>
                </div>
            `).join('')}
        </div>
    `;

    if (currentQuestion === questions.length - 1) {
        nextButton.classList.add('d-none');
        submitButton.classList.remove('d-none');
    }
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) return false;

    if (parseInt(selectedOption.value) === questions[currentQuestion].correct) {
        score++;
        scoreSpan.textContent = score;
        return true;
    }
    return false;
}

function showResults() {
    clearInterval(timerInterval);
    document.getElementById('quiz-container').classList.add('d-none');
    resultsDiv.classList.remove('d-none');
    document.getElementById('timer').classList.add('d-none');
    document.getElementById('score').classList.add('d-none');

    const percentage = (score / questions.length) * 100;
    let message = '';
    if (percentage >= 90) message = '¡Excelente!';
    else if (percentage >= 70) message = '¡Muy bien!';
    else if (percentage >= 50) message = 'Puedes mejorar';
    else message = 'Necesitas estudiar más';

    document.getElementById('final-score').innerHTML = `
        <h5 class="mb-3">${message}</h5>
        <p class="mb-4">Tu puntuación final es: ${score} de ${questions.length}</p>
        <div class="progress mb-3">
            <div class="progress-bar" role="progressbar" style="width: ${percentage}%">
                ${percentage}%
            </div>
        </div>
    `;
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    timeLeft = EXAM_DURATION; // Reiniciando con la constante
    scoreSpan.textContent = '0';
    displayQuestion();
    startTimer();
    document.getElementById('quiz-container').classList.remove('d-none');
    resultsDiv.classList.add('d-none');
    document.getElementById('timer').classList.remove('d-none');
    document.getElementById('score').classList.remove('d-none');
    nextButton.classList.remove('d-none');
    submitButton.classList.add('d-none');
}

nextButton.addEventListener('click', () => {
    checkAnswer();
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    }
});

submitButton.addEventListener('click', () => {
    checkAnswer();
    showResults();
});

restartButton.addEventListener('click', startQuiz);

// Iniciar el quiz
startQuiz();
