let game_over = false;
let game_started = false;

// Initialize the game
function init() {
  const canvas = document.getElementById("mycanvas");
  const restartButton = document.getElementById("restartButton");
  const quitButton = document.getElementById("quitButton");
  const gameOverContainer = document.getElementById("gameOverContainer");
  const gameContainer = document.getElementById("gameContainer");
  const startContainer = document.getElementById("startContainer");
  const gameOverText = document.getElementById("gameOverText");
  const gameTitle = document.getElementById("gameTitle");
  const bgMusic = document.getElementById("bgMusic");
  const eatSound = document.getElementById("eatSound");
  // All-time highest score
  let highestScore = localStorage.getItem("highestScore") || 0;


  const ctx = canvas.getContext("2d");
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

   // Adjust canvas dimensions for mobile screens
   function adjustCanvasDimensions() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }

  // Player object
  const player = {
    x: 20,
    y: H / 2,
    radius: 30,
    speed: 20,
    health: 100,
  };

  // Ladoo object
  const ladoo = {
    x: W - 100,
    y: H / 2,
    radius: 30,
  };

  // Enemies
  const enemies = [];
  const enemyCount = 3;
  let enemySpeed = 2;

  // Levels
  let currentLevel = 1;
  let scoreIncrement = 100;
  let levelIncrement = 100;

  // Initialize enemies
  function initializeEnemies() {
    enemies.length = 0;
    for (let i = 0; i < enemyCount; i++) {
      enemies.push({
        x: Math.random() * (W - 100) + 50,
        y: Math.random() * (H - 100) + 50,
        radius: 30,
        speed: enemySpeed,
      });
    }
  }

  initializeEnemies();

  // Keyboard event listeners
  const keys = {};
  document.addEventListener("keydown", function (e) {
    keys[e.key] = true;
  });

  document.addEventListener("keyup", function (e) {
    delete keys[e.key];
  });

  // Load images
  const playerImg = new Image();
  playerImg.src = "images/bheem.png";

  const ladooImg = new Image();
  ladooImg.src = "images/ladoo.gif";

  const enemyImg = new Image();
  enemyImg.src = "images/kirmada.png";

  // Background
  const background = new Image();
  background.src = "images/space.gif";
  let bgX = 0;
  let bgY = 0;

  // Draw background
  function drawBackground() {
    ctx.drawImage(background, bgX, bgY);
    ctx.drawImage(background, bgX + W, bgY);
  }

  // Update background position
  function updateBackground() {
    bgX -= 1;
    if (bgX <= -W) {
      bgX = 0;
    }
  }

  // Draw objects on the canvas
  function draw() {
    ctx.clearRect(0, 0, W, H);

    if (game_started) {
      // Draw background
      drawBackground();

      // Draw player
      ctx.drawImage(
        playerImg,
        player.x - player.radius,
        player.y - player.radius,
        player.radius * 2,
        player.radius * 2
      );

      // Draw ladoo
      ctx.drawImage(
        ladooImg,
        ladoo.x - ladoo.radius,
        ladoo.y - ladoo.radius,
        ladoo.radius * 2,
        ladoo.radius * 2
      );
       
       // Draw highest score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Highest Score: " + highestScore, 10, 50);

      // Draw enemies
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        ctx.drawImage(
          enemyImg,
          enemy.x - enemy.radius,
          enemy.y - enemy.radius,
          enemy.radius * 2,
          enemy.radius * 2
        );
      }

      // Draw score
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + player.health, 10, 20);

      // Draw level
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("Level: " + currentLevel, W - 100, 20);
    }
  }

  // Start game function
  function startGame() {
    game_started = true;
    startContainer.style.display = "none";
    canvas.style.display = "block";
    gameContainer.style.display = "flex";
    gameLoop();
    bgMusic.play();
  }
  
   // Update highest score
   function updateHighestScore() {
    if (player.health > highestScore) {
      highestScore = player.health;
      localStorage.setItem("highestScore", highestScore);
    }
  }

  // Restart game function
  function restartGame() {
    game_over = false;
    player.health = 100;
    currentLevel = 1;
    scoreIncrement = 100;
    levelIncrement = 100;
    player.x = 20;
    player.y = H / 2;
    initializeEnemies();
    gameOverContainer.style.display = "none";
    startContainer.style.display = "flex";
    gameTitle.textContent = "Chota Bheem loves Ladoo";
    game_started = false;
  }


  // Update player position
  function updatePlayerPosition() {
    if (keys["ArrowUp"] && player.y - player.radius > 0) {
      player.y -= player.speed;
    }

    if (keys["ArrowDown"] && player.y + player.radius < H) {
      player.y += player.speed;
    }

    if (keys["ArrowLeft"] && player.x - player.radius > 0) {
      player.x -= player.speed;
    }

    if (keys["ArrowRight"] && player.x + player.radius < W) {
      player.x += player.speed;
    }
  }

  // Touch event listeners
  canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    const touchX = touch.pageX - canvas.offsetLeft;
    const touchY = touch.pageY - canvas.offsetTop;

    // Handle touch input
    if (touchX < W / 2) {
      keys["ArrowLeft"] = true;
    } else {
      keys["ArrowRight"] = true;
    }
  });

  canvas.addEventListener("touchend", function (e) {
    e.preventDefault();
    delete keys["ArrowLeft"];
    delete keys["ArrowRight"];
  });


  // Check collision with ladoo
  function checkCollision() {
    const dx = player.x - ladoo.x;
    const dy = player.y - ladoo.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.radius + ladoo.radius) {
      player.health += 10;
      if (player.health > 200) {
        player.health = 200;
      }

      ladoo.x = Math.random() * (W - 100) + 50;
      ladoo.y = Math.random() * (H - 100) + 50;
      eatSound.play();

      if (player.health % scoreIncrement === 0) {
        currentLevel++;
        scoreIncrement += levelIncrement;
        levelIncrement += 50;
        enemySpeed += 0.5;
        initializeEnemies();
      }
    }
  }

  
  // Update enemy position
function updateEnemyPosition() {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < player.radius + enemy.radius) {
        const collisionScore =player.health;
        player.health -= 20;
        if (player.health <= 0) {
          gameOver(collisionScore);
        }
      }
  
      const randomFactorX = Math.random() * 2 - 1; // Random value between -1 and 1
      const randomFactorY = Math.random() * 2 - 1; // Random value between -1 and 1
  
      enemy.x += (dx / distance + randomFactorX) * enemy.speed;
      enemy.y += (dy / distance + randomFactorY) * enemy.speed;
  
      // Keep enemies within the canvas bounds
      if (enemy.x < enemy.radius) {
        enemy.x = enemy.radius;
      }
      if (enemy.x > W - enemy.radius) {
        enemy.x = W - enemy.radius;
      }
      if (enemy.y < enemy.radius) {
        enemy.y = enemy.radius;
      }
      if (enemy.y > H - enemy.radius) {
        enemy.y = H - enemy.radius;
      }
    }
  }
  

 
  
  // Game over function
  function gameOver(score) {
    game_over = true;
    game_started = false;
    gameOverText.textContent = "Game Over! Score: " + score;
    gameOverContainer.style.display = "flex";
    bgMusic.pause();
  }

  // Game loop
  function gameLoop() {
    if (!game_over) {
      draw();
      updatePlayerPosition();
      updateEnemyPosition();
      checkCollision();
      updateBackground();
      updateHighestScore(); // Update the highest score
      requestAnimationFrame(gameLoop);
    }
  }

   // Adjust canvas dimensions on window resize
   window.addEventListener("resize", adjustCanvasDimensions);
   adjustCanvasDimensions();
 
  // Event listeners for buttons
  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", restartGame);
  quitButton.addEventListener("click", () => {
    window.close();
  });
}

// Initialize the game when the DOM is ready
document.addEventListener("DOMContentLoaded", init);
