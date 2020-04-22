let bgImgs = [], panelImgs = [];

let facts = {
  listOfFacts: [],
  currentFact: -1,
  factTimer: 0,
  chooseRandom: function(){
    this.currentFact = floor(random(this.listOfFacts.length-1));
    this.factTimer = 3;
  },
  show: function(){
    textSize(16);
    textAlign(CENTER, TOP);
    if(this.currentFact != -1){
      noStroke();
      fill(0);
      text(this.listOfFacts[this.currentFact], 2, height -48, width, 100); // This gives drop shadow effect
      stroke(255);
      fill(255);
      text(this.listOfFacts[this.currentFact], 0, height -50, width, 100);

    }
  }
}

function decTimer(){
  if(facts.factTimer == 0){
    facts.currentFact = -1;
  }
  else{
    console.log(facts.factTimer);
    facts.factTimer --;
  }
}

function preload(){ // Done before setup, load the images in to arrays
  bgImgs.push(loadImage("assets/ice.png"));
  bgImgs.push(loadImage("assets/fire.png"));
  bgImgs.push(loadImage("assets/land.png"));

  panelImgs.push(loadImage("assets/IcebergL.png"));
  panelImgs.push(loadImage("assets/IcebergR.png"));
  panelImgs.push(loadImage("assets/SmogL.png"));
  panelImgs.push(loadImage("assets/SmogR.png"));
  panelImgs.push(loadImage("assets/FireL.png"));
  panelImgs.push(loadImage("assets/FireR.png"));

  facts.listOfFacts = loadStrings("facts.txt");
}

let player1 = {
  x: 10,
  y: 150,
  width: 20,
  height: 70,
  score: 0,
  img: -1,
  reset: function() {
    this.y = height / 2 - this.height / 2;
    this.img = -1;
  },
  draw: function() {
    if(this.img == -1){
      rect(this.x, this.y, this.width, this.height, 25);
    }
    else{
      image(panelImgs[this.img], this.x, this.y, this.width, this.height);
    }
  },
};

let player2 = {
  x: 600 - 30,
  y: 150,
  width: 20,
  height: 70,
  score: 0,
  img: -1,
  reset: function() {
    this.y = height / 2 - this.height / 2;
    this.img = -1;
  },
  draw: function() {
    if(this.img == -1){
      rect(this.x, this.y, this.width, this.height, 25);
    }
    else{
      image(panelImgs[this.img], this.x, this.y, this.width, this.height);
    }
  }
};

let ball = {
  x: 300,
  y: 150,
  radius: 10,
  speed: {
    x: 7.5,
    y: 0
  },
  draw: function() {
    circle(this.x, this.y, this.radius * 2);
  },
  reset: function() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed.x = 7.5;
    this.speed.y = 0;
    this.play = true;
  }
};

function setup() {
  createCanvas(600, 350);
  stroke(255);
  fill(255);

  setInterval(decTimer, 1000);
  facts.chooseRandom();
  game.reset();
}

let scoreboard = {
  draw: function() {
    textSize(25);
    text(player1.score + '  -  ' + player2.score, width / 2, 50);
    textAlign(CENTER, CENTER);
  },
  end: function(num) {
    textSize(25);
    text('Player ' + num + ' won the game!', width / 2, height / 2);
    ball.speed.x = 0;
    ball.speed.y = 0;
    ball.x = width / 2;
    ball.y = -100;
    this.press();
  },
  press: function() {
    textSize(15);
    text('Press enter to start a new game', width / 2, height / 2 + 50);
    if (keyIsDown(ENTER)) {
      game.new();
    }
  }
};

let game = {
  over: false,
  reset: function() {
    this.over = false;
    player1.reset();
    player2.reset();
    ball.reset();
  },
  new: function() {
    this.over = false;
    player1.score = 0;
    player2.score = 0;
    player1.reset();
    player2.reset();
    ball.reset();
  },
  tick: function() {
    if (this.over === false) {
      if (ball.y < 10 || ball.y > height - 10) {
        ball.speed.y *= -1;
      }
      ball.y += ball.speed.y;

      if (ball.x - ball.radius <= player1.x + player1.width) {
        if (ball.y > player1.y &&
          ball.y < player1.y + player1.height) {
          ball.speed.x *= -1;

          let angle1 = ball.y - player1.y;
          ball.speed.y = angle1 / 9;
        } else {
          this.over = true;
        }
      }

      if (ball.x + ball.radius >= player2.x) {
        if (ball.y > player2.y &&
          ball.y < player2.y + player2.height) {
          ball.speed.x *= -1;

          let angle2 = ball.y - player2.y;
          ball.speed.y -= angle2 / 9;
        } else {
          this.over = true;
        }
      }
    }
    if (ball.x < -100) {
      player2.score++;
      game.reset();
    } else if (ball.x > width + 100) {
      player1.score++;
      game.reset();
    }
    ball.x += ball.speed.x;
    ball.draw();
  }
};

function draw() {
  if (game.over === false) {
    background(0);
    if(player1.score >= 0|| player2.score >= 0){
      image(bgImgs[0], 0, 0, width, height);
      player1.img = 0;
      player2.img = 1;
    }
    if(player1.score >= 5|| player2.score >= 5){
      image(bgImgs[1], 0, 0, width, height);
      player1.img = 2;
      player2.img = 3;
    }
    if(player1.score >= 10 || player2.score >= 10){
      image(bgImgs[2], 0, 0, width, height);
      player1.img = 4;
      player2.img = 5;
    }
  } else {
    if(facts.factTimer == 0 && (player1.score == 4 || player2.score == 4 || player1.score == 9 || player2.score == 9 || player1.score == 14 || player2.score == 14)){
      facts.chooseRandom();
    }
    background(255, 0, 0, 100);
  }

  if (keyIsDown(87) && player1.y >= 3) {
    player1.y -= 7.5;
  } else if (keyIsDown(83) && player1.y <= height - player1.height - 3) {
    player1.y += 7.5;
  }
  if (keyIsDown(UP_ARROW) && player2.y >= 3) {
    player2.y -= 7.5;
  } else if (keyIsDown(DOWN_ARROW) && player2.y <= height - player2.height - 3) {
    player2.y += 7.5;
  }

  player1.draw();
  player2.draw();

  if (player1.score >= 15) {
    scoreboard.end('1');
  } else if (player2.score >= 15) {
    scoreboard.end('2');
  }


  scoreboard.draw();
  facts.show();

  game.tick();
}
