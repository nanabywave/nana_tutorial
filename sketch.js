// 전역 변수 선언
let paddle, ball, bricks;
let rows = 5, cols = 8;
let brickW, brickH;
let playing = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  paddle = new Paddle();
  ball = new Ball();
  bricks = [];
  brickW = width / cols;
  brickH = height * 0.05;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricks.push(new Brick(c * brickW, r * brickH + 60, brickW, brickH));
    }
  }
}

function draw() {
  background(255, 255, 0);
  paddle.show();
  ball.update();
  ball.show();
  for (let b of bricks) b.show();
  ball.checkPaddle(paddle);
  ball.checkBricks(bricks);
  bricks = bricks.filter(b => !b.broken);
  if (!playing) {
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(255, 100, 100);
    text('Game Over', width/2, height/2);
    noLoop();
  }
  if (bricks.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(100, 255, 100);
    text('You Win!', width/2, height/2);
    noLoop();
  }
}

function touchMoved() {
  paddle.x = constrain(mouseX - paddle.w/2, 0, width - paddle.w);
  return false;
}

function mouseMoved() {
  // 데스크탑 지원
  paddle.x = constrain(mouseX - paddle.w/2, 0, width - paddle.w);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 패들, 벽돌 위치 재설정 필요시 추가 구현
}

class Paddle {
  constructor() {
    this.w = width * 0.25;
    this.h = 18;
    this.x = width/2 - this.w/2;
    this.y = height - 40;
  }
  show() {
    fill(200, 200, 255);
    rect(this.x, this.y, this.w, this.h, 10);
  }
}

class Ball {
  constructor() {
    this.r = 16;
    this.x = width/2;
    this.y = height/2;
    this.dx = random([-5, 5]);
    this.dy = -6;
  }
  update() {
    if (!playing) return;
    this.x += this.dx;
    this.y += this.dy;
    // 벽 반사
    if (this.x < this.r || this.x > width - this.r) this.dx *= -1;
    if (this.y < this.r) this.dy *= -1;
    if (this.y > height + this.r) playing = false;
  }
  show() {
    fill(255, 220, 120);
    ellipse(this.x, this.y, this.r*2);
  }
  checkPaddle(p) {
    if (
      this.y + this.r > p.y &&
      this.x > p.x && this.x < p.x + p.w &&
      this.y < p.y + p.h
    ) {
      this.dy *= -1;
      this.y = p.y - this.r;
      // 패들 중심에서 얼마나 떨어졌는지에 따라 각도 조정
      let hit = (this.x - (p.x + p.w/2)) / (p.w/2);
      this.dx = hit * 7;
    }
  }
  checkBricks(bricks) {
    for (let b of bricks) {
      if (!b.broken &&
        this.x > b.x && this.x < b.x + b.w &&
        this.y - this.r < b.y + b.h && this.y + this.r > b.y
      ) {
        b.broken = true;
        this.dy *= -1;
        break;
      }
    }
  }
}

class Brick {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.broken = false;
    this.col = color(random(100,255), random(100,255), random(100,255));
  }
  show() {
    if (this.broken) return;
    fill(this.col);
    rect(this.x+2, this.y+2, this.w-4, this.h-4, 6);
  }
}
