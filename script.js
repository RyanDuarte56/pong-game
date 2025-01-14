const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let leftPaddle = {
  width: 12,
  height: 115,
  x: 8,
  get y() {
    return canvas.height / 2 - this.height;
  }
}

let rightPaddle = {
  width: 12,
  height: 115,
  get x() {
    return canvas.width - this.width - 8;
  },
  get y() {
    return canvas.height / 2 - this.height;
  }
}

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 15,
  dx: 5, // velocidade horizontal
  dy: 5  // velocidade vertical
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

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
}

function update() {
  // Apaga o desenho do frame anterior
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  
  // Detecta colisão da bola com as paredes laterais
  if (ball.x + ball.r > canvas.width || ball.x - ball.r < 0) {
    resetBall(); // Bola volta para o centro
  }
}

function gameLoop() {
  update(); // Atualiza a animação
  requestAnimationFrame(gameLoop); // Chama o loop novamente
}

gameLoop(); // Inicia o loop