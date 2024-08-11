const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");

// configuraciones
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -boardSize,
    ArrowDown: boardSize,
    ArrowRight: 1,
    ArrowLeft: -1
};

// variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
};

// rellena cada cuadrado del tablero
// @params
// square: posicion del cuadrado
// type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)

const drawSquare = (square, type) => {
    const [row, column] = square.split(' ');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
};

const moveSnake = () => {
    const head = snake[snake.length - 1].split(' ').map(Number);
    let newHead;

    switch (direction) {
        case 'ArrowUp':
            newHead = `${head[0] - 1} ${head[1]}`;
            break;
        case 'ArrowDown':
            newHead = `${head[0] + 1} ${head[1]}`;
            break;
        case 'ArrowRight':
            newHead = `${head[0]} ${head[1] + 1}`;
            break;
        case 'ArrowLeft':
            newHead = `${head[0]} ${head[1] - 1}`;
            break;
    }

    const [row, column] = newHead.split(' ').map(Number);

    if (row < 0 || row >= boardSize || column < 0 || column >= boardSize || boardSquares[row][column] === squareTypes.snakeSquare) {
        gameOver();
    } else {
        snake.push(newHead);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
};

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
};

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;
};

const setDirection = newDirection => {
    direction = newDirection;
};

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction !== 'ArrowDown' && setDirection(key.code);
            break;
        case 'ArrowDown':
            direction !== 'ArrowUp' && setDirection(key.code);
            break;
        case 'ArrowLeft':
            direction !== 'ArrowRight' && setDirection(key.code);
            break;
        case 'ArrowRight':
            direction !== 'ArrowLeft' && setDirection(key.code);
            break;
    }
};

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
};

const updateScore = () => {
    scoreBoard.innerHTML = score;
};

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex} ${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        });
    });
};

const setGame = () => {
    snake = ['0 0', '0 1', '0 2', '0 3'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
};

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
};

startButton.addEventListener('click', startGame);

// AHORCADO
const wordContainer = document.getElementById('wordContainer');
const startButton2 = document.getElementById('startButton2');
const usedLettersElement = document.getElementById('usedLetters');

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 0;
ctx.canvas.height = 0;

const bodyParts = [
    [4, 2, 1, 1],
    [4, 3, 1, 2],
    [3, 5, 1, 1],
    [5, 5, 1, 1],
    [3, 3, 1, 1],
    [5, 3, 1, 1]
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;

const addLetter = letter => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    usedLettersElement.appendChild(letterElement);
}

const addBodyPart = bodyPart => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(...bodyPart);
};

const wrongLetter = () => {
    addBodyPart(bodyParts[mistakes]);
    mistakes++;
    if (mistakes === bodyParts.length) endGame();
}

const endGame = () => {
    document.removeEventListener('keydown', letterEvent);
    startButton2.style.display = 'block';
}

const correctLetter = letter => {
    const { children } = wordContainer;
    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML === letter) {
            children[i].classList.toggle('hidden');
            hits++;
        }
    }
    if (hits === selectedWord.length) endGame();
}

const letterInput = letter => {
    if (selectedWord.includes(letter)) {
        correctLetter(letter);
    } else {
        wrongLetter();
    }
    addLetter(letter);
    usedLetters.push(letter);
};

const letterEvent = event => {
    let newLetter = event.key.toUpperCase();
    if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
        letterInput(newLetter);
    };
};

const drawWord = () => {
    selectedWord.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = letter.toUpperCase();
        letterElement.classList.add('letter');
        letterElement.classList.add('hidden');
        wordContainer.appendChild(letterElement);
    });
};

const selectRandomWord = () => {
    let word = words[Math.floor((Math.random() * words.length))].toUpperCase();
    selectedWord = word.split('');
};

const drawHangMan = () => {
    ctx.canvas.width = 120;
    ctx.canvas.height = 160;
    ctx.scale(20, 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d95d39';
    ctx.fillRect(0, 7, 4, 1);
    ctx.fillRect(1, 0, 1, 8);
    ctx.fillRect(2, 0, 3, 1);
    ctx.fillRect(4, 1, 1, 1);
};

const startGame2 = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    startButton2.style.display = 'none';
    drawHangMan();
    selectRandomWord();
    drawWord();
    document.addEventListener('keydown', letterEvent);
};

startButton2.addEventListener('click', startGame2);

// CRONOMETRO
const stopwatch = document.getElementById('stopwatch')
const playPauseButton = document.getElementById('play-pause')
const secondSphere = document.getElementById('seconds-sphere')

let stopwatchInterval
let runningTime = 0 // Inicializar a 0

const playPause = () => {
    const isPaused = !playPauseButton.classList.contains('running')
    if (isPaused) {
        playPauseButton.classList.add('running')
        start()
    } else {
        playPauseButton.classList.remove('running')
        pause()
    }
}

const pause = () => {
    secondSphere.style.animationPlayState = 'paused'
    clearInterval(stopwatchInterval)
}

const stop = () => {
    secondSphere.style.transform = 'rotate(-90deg) translateX(60px)'
    secondSphere.style.animation = 'none'
    playPauseButton.classList.remove('running')
    runningTime = 0
    clearInterval(stopwatchInterval)
    stopwatch.textContent = '00:00'
}

const start = () => {
    secondSphere.style.animation = 'rotacion 60s linear infinite'
    let startTime = Date.now() - runningTime
    secondSphere.style.animationPlayState = 'running'
    stopwatchInterval = setInterval(() => {
        runningTime = Date.now() - startTime
        stopwatch.textContent = calculateTime(runningTime)
    }, 1000)
}

const calculateTime = runningTime => {
    const total_seconds = Math.floor(runningTime / 1000)
    const total_minutes = Math.floor(total_seconds / 60)

    const display_seconds = (total_seconds % 60).toString().padStart(2, "0")
    const display_minutes = total_minutes.toString().padStart(2, "0")

    return `${display_minutes}:${display_seconds}`
}

// CALCULADORA
const displayValorAnterior = document.getElementById('valor-anterior');
const displayValorActual = document.getElementById('valor-actual');
const botonesNumeros = document.querySelectorAll('.numero');
const botonesOperadores = document.querySelectorAll('.operador');

const display = new Display(displayValorAnterior, displayValorActual);

botonesNumeros.forEach(boton => {
    boton.addEventListener('click', () => display.agregarNumero(boton.innerHTML));
});

botonesOperadores.forEach(boton => {
    boton.addEventListener('click', () => display.computar(boton.value))
});

// GENERADOR DE PALETAS DE COLORES
const palleteContainer = document.getElementById('palleteContainer');
const colorRange = document.getElementById('colorRange');
const colorValues = ['1','2','3','4','6','7','8','9','A','B','C','D','E','F'];
const PALLETE_SIZE = 5;

const createPallete = () => {
    palleteContainer.innerHTML = '';
    for(let i = 0; i < PALLETE_SIZE; i++) {
        const palleteElement = document.createElement('div');
        palleteElement.classList.add('palleteItem');
        palleteContainer.appendChild(palleteElement);
    }
    updatePallete();
}

const colorize = (element) => {
    let color = '#';
    for(let i = 0; i < 6; i++) {
        const randomElement = colorValues[Math.floor(Math.random() * colorValues.length)];
        color += randomElement;
    };
    element.style.backgroundColor = color; 
    element.innerHTML = `<span class='colorHex'>${color}</span>`;   
}

const updatePallete = () => {
    for (let i = 0; i < palleteContainer.children.length; i++) {
        colorize(palleteContainer.children[i])
    }
};

createPallete();

// ORGANIZADOR DE TAREAS
// Info date
const dateNumber = document.getElementById('dateNumber');
const dateText = document.getElementById('dateText');
const dateMonth = document.getElementById('dateMonth');
const dateYear = document.getElementById('dateYear');

// Tasks Container
const tasksContainer = document.getElementById('tasksContainer');

const setDate = () => {
    const date = new Date();
    dateNumber.textContent = date.toLocaleString('es', { day: 'numeric' });
    dateText.textContent = date.toLocaleString('es', { weekday: 'long' });
    dateMonth.textContent = date.toLocaleString('es', { month: 'short' });
    dateYear.textContent = date.toLocaleString('es', { year: 'numeric' });
};

const addNewTask = event => {
    event.preventDefault();
    const { value } = event.target.taskText;
    if (!value) return;
    const task = document.createElement('div');
    task.classList.add('task', 'roundBorder');
    task.addEventListener('click', changeTaskState)
    task.textContent = value;
    tasksContainer.prepend(task);
    event.target.reset();
};

const changeTaskState = event => {
    event.target.classList.toggle('done');
};

const order = () => {
    const done = [];
    const toDo = [];
    tasksContainer.childNodes.forEach(el => {
        el.classList.contains('done') ? done.push(el) : toDo.push(el)
    })
    return [...toDo, ...done];
}

const renderOrderedTasks = () => {
    order().forEach(el => tasksContainer.appendChild(el))
}

setDate();

// CIFRADOR CESAR
const alfabeto = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const inputOriginal = document.getElementById('input-original');
const cifrador = document.getElementById('cifrador');
const resultado = document.getElementById('resultado');
const rango = document.getElementById('rango');

const shifMessage = () => {
    const wordArray = [...inputOriginal.value.toUpperCase()];
    printChar(0, wordArray);
}

const printChar = (currentLetterIndex, wordArray) => {
    if (wordArray.length === currentLetterIndex) return;
    inputOriginal.value = inputOriginal.value.substring(1)
    const spanChar = document.createElement("span");
    resultado.appendChild(spanChar);
    animateChar(spanChar)
        .then(() => {
            const charSinCodificar = wordArray[currentLetterIndex];
            spanChar.innerHTML = alfabeto.includes(charSinCodificar) ?
                alfabeto[(alfabeto.indexOf(charSinCodificar) + parseInt(rango.value)) % alfabeto.length] :
                charSinCodificar
            printChar(currentLetterIndex + 1, wordArray);
        });
}

const animateChar = spanChar => {
    let cambiosDeLetra = 0;
    return new Promise(resolve => {
        const intervalo = setInterval(() => {
            spanChar.innerHTML = alfabeto[Math.floor(Math.random() * alfabeto.length)];
            cambiosDeLetra++;
            if (cambiosDeLetra === 3) {
                clearInterval(intervalo);
                resolve();
            }
        }, 50);
    });
}

const submit = e => {
    e.preventDefault();
    resultado.innerHTML = '';
    shifMessage()
}

cifrador.onsubmit = submit;
