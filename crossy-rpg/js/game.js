// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');
var upkey;
var downKey;
var rightKey;
var leftKey;

// some parameters for our scene
gameScene.init = function() {
  this.playerSpeed = 5;
  this.enemyMaxY   = 330;
  this.enemyMinY   = 30;
}

// load asset files for our game
gameScene.preload = function() {

  // load images
  this.load.image('background', 'assets/checkerboard.png');
  this.load.image('player', 'assets/Our_Hero.png');
  this.load.image('enemy', 'assets/dr_tommy.png');
  this.load.image('treasure', 'assets/a+.png');
};

// executed once, after assets were loaded
gameScene.create = function() {

  // background
  let bg = this.add.sprite(0, 0, 'background');

  // change origin to the top-left of the sprite
  bg.setOrigin(0, 0);

  // player
  this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');

  // scale down
  this.player.setScale(.03);

  // goal
  this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  this.treasure.setScale(0.2);

  // group of enemies
  this.enemies = this.add.group({
    key: 'enemy',
    repeat: 9,
    setXY: {
      x: 110,
      y: 100,
      stepX: 80,
      stepY: 20
    }

   
  });
   //directions
   upKey    = gameScene.input.keyboard.addKey(38);
   downKey  = gameScene.input.keyboard.addKey(40);
   leftKey  = gameScene.input.keyboard.addKey(37);
   rightKey = gameScene.input.keyboard.addKey(39);
   console.log(rightKey);

  // scale enemies
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

  // set speeds
  Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
    enemy.speed = Math.random() * 2 + 1;
  }, this);

  // player is alive
  this.isPlayerAlive = true;

  // reset camera
  this.cameras.main.resetFX();

};

// executed on every frame (60 times per second)
gameScene.update = function() {
  // only if the player is alive
  if (!this.isPlayerAlive) {
    return;
  }

  // check for active input
  if (rightKey.isDown) {
    // player walks
    this.player.x += this.playerSpeed;
  }
  if(leftKey.isDown){
    this.player.x -= this.playerSpeed;
  }

  if(upKey.isDown){
    if(this.player.y >= this.enemyMinY ){
      this.player.y -= this.playerSpeed;
    }
  }
  if(downKey.isDown){
    if(this.player.y <= this.enemyMaxY){
      this.player.y += this.playerSpeed;
    }
  }

  // Getting the A+
  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
    this.gameWon();
  }

  // enemy movement and collision
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i = 0; i < numEnemies; i++) {

    // move enemies
    enemies[i].y += enemies[i].speed;

    // reverse movement if reached the edges
    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }

    // enemy collision
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
      this.gameOver();
      break;
    }
  }
};

gameScene.gameOver = function() {

  // flag to set player is dead
  this.isPlayerAlive = false;

  // shake the camera
  this.cameras.main.shake(500);

  // fade camera
  this.time.delayedCall(250, function() {
    this.cameras.main.fade(250);
  }, [], this);

  // restart game
  this.time.delayedCall(500, function() {
    this.scene.restart();
  }, [], this);
};
gameScene.gameWon =function() {
  window.alert("You Have Defeated The Evil Dr. Tommy! Refresh page to play again!");

};



// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 360,
  scene: gameScene
};
console.log(this.player);
// create the game, and pass it the configuration
let game = new Phaser.Game(config);
