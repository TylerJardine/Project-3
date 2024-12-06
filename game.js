const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

const colors = ['red', 'green', 'blue', 'yellow'];
let sequence = [];
let playerSequence = [];
let isPlayerTurn = false;
let gameOver = false;

function drawBoard() {
  const borderWidth = 10;
  const squarePadding = 5;
  const size = (canvas.width - borderWidth * 2 - squarePadding * 2) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(
      borderWidth + squarePadding + (i % 2) * size,
      borderWidth + squarePadding + Math.floor(i / 2) * size,
      size,
      size
    );
  });
}

function highlightButton(color) {
  if (gameOver) return;

  const borderWidth = 10;
  const squarePadding = 5;
  const size = (canvas.width - borderWidth * 2 - squarePadding * 2) / 2;
  const colorIndex = colors.indexOf(color);

  ctx.fillStyle = 'white';
  ctx.fillRect(
    borderWidth + squarePadding + (colorIndex % 2) * size,
    borderWidth + squarePadding + Math.floor(colorIndex / 2) * size,
    size,
    size
  );

  setTimeout(() => {
    if (!gameOver) {
      ctx.fillStyle = color;
      ctx.fillRect(
        borderWidth + squarePadding + (colorIndex % 2) * size,
        borderWidth + squarePadding + Math.floor(colorIndex / 2) * size,
        size,
        size
      );
    }
  }, 250);
}

function displayGameOver() {
  gameOver = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);

  const tryAgainButton = document.createElement('button');
  tryAgainButton.textContent = 'Try Again';
  tryAgainButton.style.display = 'block';
  tryAgainButton.style.margin = '20px auto';
  tryAgainButton.style.fontSize = '20px';
  tryAgainButton.onclick = () => {
    tryAgainButton.remove();
    startGame();
  };

  document.body.appendChild(tryAgainButton);
}

function playSequence() {
  let i = 0;

  const interval = setInterval(() => {
    highlightButton(sequence[i]);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
      isPlayerTurn = true;
    }
  }, 1000);
}

function startGame() {
  sequence = [];
  playerSequence = [];
  isPlayerTurn = false;
  gameOver = false;

  drawBoard();
  addStepToSequence(true);
  playSequence();
}

function addStepToSequence(isFirstStep = false) {
  let randomColor;

  do {
    randomColor = colors[Math.floor(Math.random() * colors.length)];
  } while (isFirstStep && sequence.length > 0 && randomColor === sequence[0]);

  sequence.push(randomColor);
}

function checkPlayerInput() {
  for (let i = 0; i < playerSequence.length; i++) {
    if (playerSequence[i] !== sequence[i]) {
      isPlayerTurn = false;
      displayGameOver();
      return;
    }
  }

  if (playerSequence.length === sequence.length) {
    isPlayerTurn = false;
    playerSequence = [];
    addStepToSequence();
    playSequence();
  }
}

function handlePlayerInput(color) {
  if (!isPlayerTurn || gameOver) return;

  playerSequence.push(color);
  highlightButton(color);
  checkPlayerInput();
}

document.addEventListener('keydown', (event) => {
  if (!isPlayerTurn || gameOver) return;

  const keyToColor = {
    r: 'red',
    g: 'green',
    b: 'blue',
    y: 'yellow'
  };

  const color = keyToColor[event.key.toLowerCase()];
  if (color) handlePlayerInput(color);
});

canvas.addEventListener('click', (event) => {
  if (!isPlayerTurn || gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const clickedColor = getClickedColor(x, y);
  handlePlayerInput(clickedColor);
});

function getClickedColor(x, y) {
  const borderWidth = 10;
  const squarePadding = 5;
  const size = (canvas.width - borderWidth * 2 - squarePadding * 2) / 2;

  const col = Math.floor((x - borderWidth - squarePadding) / size);
  const row = Math.floor((y - borderWidth - squarePadding) / size);

  return colors[row * 2 + col];
}

startButton.addEventListener('click', startGame);

drawBoard();
