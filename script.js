const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;

const ctx = canvas.getContext("2d");

// offsetY é usado para alterar o valor de y das raquetes ao movê-las, preservando a função getter
let leftPaddle = {
  width: 12,
  height: 115,
  x: 8,
  get y() {
    return canvas.height / 2 - this.height + this.offsetY;
  },
  offsetY: 0
}

let rightPaddle = {
  width: 12,
  height: 115,
  get x() {
    return canvas.width - this.width - 8;
  },
  get y() {
    return canvas.height / 2 - this.height + this.offsetY;
  },
  offsetY: 0
}

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 15,
  dx: 10, // velocidade horizontal
  dy: 10  // velocidade vertical
}

function drawLeftPaddle() {
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.closePath();
}

function drawRightPaddle() {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

const winMessage = document.getElementById("win-message");
const newGameButton = document.getElementById("new-game-button");
const enterToNewGameMessage = document.getElementById("enter-to-new-game-message");

// Determina se o jogo está ativo ou não
let gameActive = true;

// Variáveis relacionadas à pontuação do jogo
const score = document.getElementById("score");
let leftScore = 0;
let rightScore = 0;

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  score.textContent = `${leftScore} x ${rightScore}`;

  if (leftScore === 10 || rightScore === 10) {
    gameOver();
  }
}

function gameOver() {
  gameActive = false;
  
  // A bola fica parada no centro
  ball.dx = 0;
  ball.dy = 0;

  // Mensagens e botão aparecem
  winMessage.classList.remove("hidden");
  newGameButton.classList.remove("hidden");
  enterToNewGameMessage.classList.remove("hidden");

  if (leftScore === 10) {
    winMessage.textContent = "Left player wins!";
  } else {
    winMessage.textContent = "Right player wins!";
  }
}

// Clique no botão ou pressionar Enter realizam o restart
newGameButton.addEventListener("click", gameRestart);
document.addEventListener("keydown", event => {
  if (event.code === "Enter" && !newGameButton.classList.contains("hidden")) {
    gameRestart();
  }
});

function gameRestart() {
  gameActive = true;

  // Bola volta a se mover
  ball.dx = 10;
  ball.dy = 10;

  // Pontuações zeradas
  leftScore = 0;
  rightScore = 0;
  score.textContent = "0 x 0";

  // Mensagens e botão ficam invisíveis
  winMessage.classList.add("hidden");
  newGameButton.classList.add("hidden");
  enterToNewGameMessage.classList.add("hidden");
}

// Armazena o estado das teclas pressionadas
const keys = {};

document.addEventListener("keydown", event => {
  // Desativa a movimentação das raquetes
  if (!gameActive) {
    return;
  }

  keys[event.code] = true;
});

document.addEventListener("keyup", event => {
  keys[event.code] = false;
});

// Loop principal
function update() {
  // Apaga o desenho do frame anterior
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move as raquetes
  if (keys["KeyW"] && leftPaddle.y > 0) {
    leftPaddle.offsetY -= 5;
  }
  if (keys["KeyS"] && leftPaddle.y + leftPaddle.height < canvas.height) {
    leftPaddle.offsetY += 5;
  }
  if (keys["ArrowUp"] && rightPaddle.y > 0) {
    rightPaddle.offsetY -= 5;
  }
  if (keys["ArrowDown"] && rightPaddle.y + rightPaddle.height < canvas.height) {
    rightPaddle.offsetY += 5;
  }

  // Desenha os objetos
  drawLeftPaddle();
  drawRightPaddle();
  drawBall();

  // Atualiza a posição da bola
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Detecta colisão da bola com as raquetes
  if (ball.x - ball.r < leftPaddle.x + leftPaddle.width &&
      ball.x + ball.r > leftPaddle.x &&
      ball.y > leftPaddle.y &&
      ball.y < leftPaddle.y + leftPaddle.height
      ||
      ball.x + ball.r > rightPaddle.x &&
      ball.x - ball.r < rightPaddle.x + rightPaddle.width &&
      ball.y > rightPaddle.y &&
      ball.y < rightPaddle.y + rightPaddle.height) {
    ball.dx *= -1; // Inverte a velocidade horizontal
  }

  // Detecta colisão da bola com as paredes verticais
  if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
    ball.dy *= -1; // Inverte a velocidade vertical
  }
  
  // Detecta colisão da bola com a parede da esquerda
  if (ball.x - ball.r < 0) {
    rightScore++; // +1 ponto para a raquete da direita
    resetBall(); // Bola volta para o centro
  }

  // Detecta colisão da bola com a parede da direita
  if (ball.x + ball.r > canvas.width) {
    leftScore++; // +1 ponto para a raquete da esquerda
    resetBall();
  }

  requestAnimationFrame(update); // Chama o loop novamente
}

const playButton = document.getElementById("play-button");
const enterToPlayMessage = document.getElementById("enter-to-play-message");

// Inicia o loop ao clicar no botão Play ou pressionar Enter
playButton.addEventListener("click", startLoop);
document.addEventListener("keydown", event => {
  if (event.code === "Enter" && !playButton.classList.contains("hidden")) {
    startLoop();
  }
});

function startLoop() {
  playButton.classList.add("hidden");
  enterToPlayMessage.classList.add("hidden");
  score.classList.remove("hidden");
  score.textContent = "0 x 0";
  update();
}