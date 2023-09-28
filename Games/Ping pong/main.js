// {"name": "PING PONG", "author": "Eclipse Blade", "version": "1.0", "icon": "icon.png", "file": "main.js", "description": "ping pong game, compatible with 2 players "}
import { debug, GoBrowser } from  "../../Assets/sys.js";
const canvas = Screen.getMode();
canvas.width = 640;
canvas.height = 448;
Screen.setMode(canvas);
const vfont = new Font();
vfont.scale = 0.8;
var reactionSpeed = 0.02
vfont.color = Color.new(0,0,0);
const font = new Font(System.boot_path + "Assets/Fonts/pixel.ttf");
const font3 = new Font(System.boot_path + "Assets/Fonts/pixel.ttf");
const font3s = new Font(System.boot_path + "Assets/Fonts/pixel.ttf");
const font2 = new Font(System.boot_path + "Assets/Fonts/pixel.ttf");
const colors = {
  Black: Color.new(0, 0, 0),
  White: Color.new(255, 255, 255),
  BlueLight: Color.new(0, 0, 230),
  Blue: Color.new(0, 0, 255),
  Red: Color.new(255, 0, 0)
};
font2.scale = 2.3f;
font2.color = colors.BlueLight;
font3.scale = 1.5f;
font3s.scale = 1.5f;
font3.color = colors.BlueLight;
font3s.color = colors.White;
const paddleWidth = 20;
const paddleHeight = 80;
const paddleSpeed = 5;
const ballRadius = 10;
var mode = 0;
var ballSpeed = 5;
var item = 1;
var bg = new Image(System.boot_path + "Games/Ping pong/assets/bg.png");
var menu = new Image(System.boot_path + "Games/Ping pong/assets/menu.png");
let player1Score = 0;
let player2Score = 0;
var screen = 0;
var vcount = 0;
var win1 = false;
var win2 = false;
var paused = false;
var vseconds = 0;
var pad = Pads.get();
let player1X = 3;
let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2X = canvas.width - paddleWidth - 3;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = 0; // Modificado para 0 para que a bola não se mova antes do jogo começar
let ballDY = 0; // Modificado para 0 para que a bola não se mova antes do jogo começar
let countDown = 3; // Tempo inicial para a partida começar
let isCounting = false; // Variável para controlar o contador de tempo
let isGameStarted = false; // Variável para controlar se o jogo já começou
function rectRect(rect1, rect2) {
    return rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x && rect1.y < rect2.y + rect2.h && rect1.h + rect1.y > rect2.y;
}
class Game {
  screens() {
    switch (screen) {
      case 0:
        this.menuPlay();
        break;
      case 1:
        this.play();
        break;
      case 2:
        this.play2();
        break;
    }
  }

  menuPlay() {
    
    pad.update()
    menu.draw(0, 0);
    let sz0 = font3.getTextSize("P1 VS CPU");
    font3.print(canvas.width/2-sz0.width/2,canvas.height/2-sz0.height/2,"P1 VS CPU");
    let sz3 = font3s.getTextSize("P1 VS P2");
    font3s.print(canvas.width/2-sz3.width/2,canvas.height/2-sz3.height/2+50,"P1 VS P2");
    if (pad.justPressed(Pads.DOWN) && item == 1) {
      item++;
    switch (item) {
      case 1:
        font3s.color = colors.White;
        font3.color = colors.BlueLight;
        break;
      case 2:
        font3.color = colors.White;
        font3s.color = colors.BlueLight;
        break;
    }     
    }
    if (pad.justPressed(Pads.UP) && item == 2) {
      item--;
    switch (item) {
      case 1:
        font3s.color = colors.White;
        font3.color = colors.BlueLight;
        break;
      case 2:
        font3.color = colors.White;
        font3s.color = colors.BlueLight;
        break;
    }           
    }    
    if (pad.justPressed(Pads.CROSS) && item == 2) {
      this.reset();
      this.startCountDown();
      ballSpeed = 5;
      mode = 0;
      screen = 1;
    }
    if (pad.justPressed(Pads.CROSS) && item == 1) {
      this.reset();
      this.startCountDown();
      ballSpeed = 5;
      mode = 1;
      //mode 1 p1 vs cpu 
      //mode 0 p1 vs p2
      screen = 1;
    }
  }

  play() { //p1 vs p2
    // Limpar a tela
  Screen.clear();
  bg.draw(0, 0);
  pad.update()
      if (newPad.ly < -50 && isGameStarted && player1Y > 0) {
        player1Y -= paddleSpeed;
      }
      if (newPad.ly > 50 && isGameStarted && player1Y + paddleHeight < canvas.height) {
        player1Y += paddleSpeed;
      }
      if (newPad.ry < -50 && isGameStarted && player2Y > 0 && mode == 0) {
        player2Y -= paddleSpeed;
      }
      if (newPad.ry > 50 && isGameStarted && player2Y + paddleHeight < canvas.height && mode == 0) {
        player2Y += paddleSpeed;
      }
      if(isGameStarted) {
      ballX += ballDX * ballSpeed;
      ballY += ballDY * ballSpeed;
      }
   // Movimentação da CPU (player2)
    if (isGameStarted && mode == 1) {
      // Definir a velocidade de reação da CPU de forma aleatória entre 0.02 e 0.8
      reactionSpeed = 0.03 + Math.random() * 0.9;
      
      // A CPU vai acompanhar a posição vertical da bola, mas com um leve atraso
      // para criar um comportamento mais humano e aleatório.
      const targetY = ballY - paddleHeight / 2;
      const diffY = targetY - player2Y;
      player2Y += diffY * reactionSpeed;

      // Introduzir um erro na movimentação da CPU
      const errorChance = 0.5; // 10% de chance de erro
      if (Math.random() < errorChance) {
        // Mover a raquete da CPU em uma direção aleatória (para cima ou para baixo)
        const randomDirection = Math.random() < 0.5 ? -1 : 1;
        player2Y += randomDirection * paddleSpeed;
      }

      // Limitar o movimento da CPU para que ela não saia da tela
      if (player2Y < 0) {
        player2Y = 0;
      } else if (player2Y + paddleHeight > canvas.height) {
        player2Y = canvas.height - paddleHeight;
      }
    }

      // Verificar colisão com as bordas superiores e inferiores
      if (ballY < ballRadius || ballY + ballRadius > canvas.height - ballRadius) {
        ballDY *= -1;
      }

      // Verificar colisão com os jogadores
  if (rectRect({ x: ballX - ballRadius, y: ballY - ballRadius, w: ballRadius * 2, h: ballRadius * 2 }, { x: player1X, y: player1Y, w: paddleWidth, h: paddleHeight })) {
    ballDX = Math.abs(ballDX); // Inverter a direção horizontal da bola
    ballSpeed = ballSpeed + 0.1;
  }

  if (rectRect({ x: ballX - ballRadius, y: ballY - ballRadius, w: ballRadius * 2, h: ballRadius * 2 }, { x: player2X, y: player2Y, w: paddleWidth, h: paddleHeight })) {
    ballDX = -Math.abs(ballDX); // Inverter a direção horizontal da bola
    ballSpeed = ballSpeed + 0.1;
  }
      // Verificar se a bola passou pelos jogadores e marcar o ponto
      if (ballX < 0) {
        player2Score++;
        ballSpeed = 5;
        this.reset(); // Correção aqui: adicionando os parênteses para chamar a função reset()
        this.startCountDown(); // Reinicia a contagem quando alguém marca ponto
      }
      if (ballX > canvas.width) {
        player1Score++;
        ballSpeed = 5;
        this.reset(); // Correção aqui: adicionando os parênteses para chamar a função reset()
        this.startCountDown(); // Reinicia a contagem quando alguém marca ponto
      }
      // Desenhar jogadores
      Draw.rect(player1X, player1Y, paddleWidth, paddleHeight, colors.Blue);
      Draw.rect(player2X, player2Y, paddleWidth, paddleHeight, colors.Red);

      // Desenhar bola
      Draw.circle(ballX, ballY, ballRadius, colors.White, true);
    if(win1) {
      let szh = font2.getTextSize("BLUE WIN");
      font2.print(canvas.width/2-szh.width/2, canvas.height/2-szh.height/2 + 50, "BLUE WIN");
    }
    if(win2) {
      let szh = font2.getTextSize("RED WIN");
      font2.print(canvas.width/2-szh.width/2, canvas.height/2-szh.height/2 + 50, "RED WIN");
    }
    if(player1Score == 5) {
      player2Score = 0;
      player1Score = 0;
      win1 = true;
      isGameStarted = false;
      this.reset(); 
      this.startCountDown(); 
    }
    if(player2Score == 5) {
      player2Score = 0;
      player1Score = 0;
      win2 = true;
      isGameStarted = false;
      this.reset(); 
      this.startCountDown(); 
    }
    if (!isCounting) {
      this.countDown();
    } 
    if (paused) {
    let pont = font2.getTextSize(`${player1Score} X ${player2Score}`);
    font2.print(canvas.width/2-pont.width/2, canvas.height/2-pont.height/2 + 100, `${player1Score} X ${player2Score}`);
    font.scale = 2.3f;
    font.color = colors.BlueLight;
    let szv = font.getTextSize("PAUSED");
      font.print(canvas.width / 2 - szv.width/2, canvas.height / 2 - szv.height/2, "PAUSED");
    if (pad.justPressed(Pads.CIRCLE) && paused) {
          player1Score = 0;
          player2Score = 0;
          screen = 0;
          paused = false;
          isGameStarted = true;
        }
    }
    if (pad.justPressed(Pads.START) && isCounting) {
          switch(paused){
          case false:
            paused = true;
            isGameStarted = false;
            break;
          case true:
            paused = false;
            isGameStarted = true;
            break;
          }
        }
  }
  reset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = 0; // Modificado para 0 para que a bola não se mova antes do jogo começar
    ballDY = 0; // Modificado para 0 para que a bola não se mova antes do jogo começar
  }

  countDown() {
    if (countDown >= 1) {
      font.scale = 2.3f;
      font.color = colors.BlueLight;
      let sz = font.getTextSize(countDown.toString())
      font.print(canvas.width / 2 - sz.width/2, canvas.height / 2 - sz.height/2, countDown.toString());
    } else {
      isCounting = true;
      isGameStarted = true;
      win1 = false;
      win2 = false;
      ballDX = Math.random() < 0.5 ? -1 : 1;
      ballDY = Math.random() < 0.5 ? -1 : 1;
    }
  }

  startCountDown() {
    isCounting = false;
    isGameStarted = false;
    countDown = 3;
  }
}

os.setInterval(() => {
  const gameInstance = new Game();
  Screen.clear();
  GoBrowser();
  gameInstance.screens();
  if (!isCounting && !isGameStarted && screen == 1) {
  vcount++;
  if(vcount >= 60) {
    vcount = 0
    vseconds++
    countDown = countDown - 1;
    gameInstance.countDown();
  }
  }
  debug();
  Screen.flip();
},0);