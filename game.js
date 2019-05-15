//Initialize canvas and canvas context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Initialize database array
var json;

//Initialize images
var ufo = new Image();
var background = new Image();
var asteroid = new Image();
var asteroid2 = new Image();
var gameOver = new Image();
var title = new Image();
var box = new Image();

ufo.src = "img/ufo.png";
background.src = "img/background.png";
asteroid.src = "img/asteroid1.png";
asteroid2.src = "img/asteroid2.png";
gameOver.src = "img/gameoverbackground.png";
title.src = "img/title.png";
box.src = "img/box.png";

//Initialize audio
var scoreSound = new Audio();
var crashSound = new Audio();
var menuMusic = new Audio();
var menuClick = new Audio();

scoreSound.src = "sound/score_sound.wav";
crashSound.src = "sound/crash_sound.ogg";
menuMusic.src = "sound/menu_music.ogg";
menuClick.src = "sound/menu_click.wav";

//Initialize buttons, table and leaderboards input
var menuFromGameButton = document.getElementById("menuFromGame");
var menuButton = document.getElementById("menu");
var submitButton = document.getElementById("submit");
var replayButton = document.getElementById("replay");
var playButton = document.getElementById("play");
var leaderboardsButton = document.getElementById("leaderboards");
var leaderboardsFromGameButton = document.getElementById("leaderboardsFromGame");
var creditsButton = document.getElementById("credits");
var input = document.getElementById("input");
var submitted = document.getElementById("submitted");
var table = document.getElementById("table");

table.style.display = "none";

//Initialize ufo starting X and Y positions
var ufoX = 400;
var ufoY = 230;

//Initialize game variables
var score = 0;
var velocity = 0;
var density = 1;
var crashed = false;

//Initialize starting asteroid X and Y positions
var x = new Array(8);
var y = new Array(8);

//Initialize asteroid single frame movements (each time the game() function is called)
var moveX = new Array(8);
var moveY = new Array(8);

moveX[0] = 1;
moveY[0] = 0;

moveX[1] = 1;
moveY[1] = 0.75;

moveX[2] = 0;
moveY[2] = 1;

moveX[3] = -1;
moveY[3] = 0.75;

moveX[4] = -1;
moveY[4] = 0;

moveX[5] = -1;
moveY[5] = -0.75;

moveX[6] = 0;
moveY[6] = -1;

moveX[7] = 1;
moveY[7] = -0.75;

//Initialize helper variables
var sideSelector = new Array(4);
var asteroidSelector = 0;
var activeAsteroids = new Array(16);
var currentScreen;

//Initialize counters
var functionCounter = 0;
var asteroidCount = 0;

//Keyboard controls
document.onkeydown = function(e) {
  switch (e.keyCode) {
    case 37: //Left key -- move left
      if (ufoX <= 0)
        ufoX = 0;
      else
        ufoX -= 120;
      break;
    case 38: //Up key -- move up
      e.view.event.preventDefault();
      if (ufoY <= 0)
        ufoY = 0;
      else
        ufoY -= 80;
      break;
    case 39: //Right key -- move right
      if (ufoX >= 674)
        ufoX = 674;
      else
        ufoX += 120;
      break;
    case 40: //Down key -- move down
      e.view.event.preventDefault();
      if (ufoY >= 546)
        ufoY = 546;
      else
        ufoY += 80;
      break;
    case 65: //"a" key -- move left
      if (ufoX <= 0)
        ufoX = 0;
      else
        ufoX -= 120;
      break;
    case 68: //"d" key -- move right
      if (ufoX >= 674)
        ufoX = 674;
      else
        ufoX += 120;
      break;
    case 83: // "s" key -- move down
    if (ufoY >= 546)
      ufoY = 546;
    else
      ufoY += 80;
    break;
    case 87: // "w" key -- move up
    if (ufoY <= 0)
      ufoY = 0;
    else
      ufoY -= 80;
    break;
    }
};

//Helper function that draws the specific background for each menu page (main, leaderboards, credits)
function drawMenuBackground() {
  ctx.drawImage(background, 0, 0, 800, 600);
  menuMusicController();

  if (currentScreen == 1) {
    ctx.drawImage(title, 200, 50, 400, 60);
  }
  else if (currentScreen == 2) {
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText("Leaderboards", 250, 100);

    ctx.drawImage(box, 5, 120, 790, 375);
  }
  else if (currentScreen == 3) {
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText("Credits", 300, 100);

    ctx.drawImage(box, 5, 120, 790, 375);

    ctx.font = "18px Arial";
    ctx.fillText("Source Code: https://github.com/PD9696", 40, 160);
    ctx.fillText("Asteroid Images: https://opengameart.org/users/funwithpixels", 40, 210);
    ctx.fillText("Background Image: https://opengameart.org/content/solar-system", 40, 260);
    ctx.fillText("Menu Music: https://opengameart.org/content/through-space", 40, 310);
    ctx.fillText("Button Click Sound: https://opengameart.org/content/metal-click", 40, 360);
    ctx.fillText("Point(s) Gained Sound: https://opengameart.org/content/sci-fi-shwop-1", 40, 410);
    ctx.fillText("Crash Sound: https://opengameart.org/content/3-background-crash-explosion-bang-sounds", 40, 460);
  }

  requestAnimationFrame(drawMenuBackground);
}

//Controls when to play menu music
function menuMusicController() {
  if (currentScreen == 1 || currentScreen == 2 || currentScreen == 3)
    menuMusic.play();
  else
    menuMusic.pause();
}

//Helper function to draw the background
function drawGameBackground() {
  ctx.drawImage(background, 0, 0, 800, 600);
  requestAnimationFrame(drawGameBackground);
}

//Main menu page
function menu() {
  menuClick.play();
  currentScreen = 1;
  drawMenuBackground();

  menuButton.style.display = "none";
  submitButton.style.display = "none";
  replayButton.style.display = "none";
  leaderboardsFromGameButton.style.display = "none";
  menuFromGameButton.style.display = "none";
  input.style.display = "none";
  submitted.style.display = "none";
  table.style.display = "none";

  playButton.style.display = "block";
  leaderboardsButton.style.display = "block";
  creditsButton.style.display = "block";
}

//Prepares and opens leaderboards page
function leaderboards() {
  sendAndReceive();
  clearTable();
  fillTable();
  menuClick.play();
  currentScreen = 2;
  drawMenuBackground();

  submitted.style.display = "none";
  replayButton.style.display = "none";
  playButton.style.display = "none";
  leaderboardsButton.style.display = "none";
  creditsButton.style.display = "none";
  leaderboardsFromGameButton.style.display = "none";
  menuFromGameButton.style.display = "none";

  menuButton.style.display = "block";
  table.style.display = "block";
}

//Opens Credits page
function credits() {
  menuClick.play();
  currentScreen = 3;
  drawMenuBackground();

  playButton.style.display = "none";
  leaderboardsButton.style.display = "none";
  creditsButton.style.display = "none";

  menuButton.style.display = "block";
}

/*Takes in user's name as input and calls sendAndReceive() function
which sends it along with the user's score to the database */
function submit() {
  menuClick.play();
  var isSubmitted;

  if (input.value.length > 0 && isSubmitted != true) {
    name = input.value;
    input.style.display = "none";
    submitted.style.display = "block";
    submitButton.style.display = "none";
    leaderboardsFromGameButton.style.display = "block";
    sendAndReceive();
    isSubmitted = true;
  }
  else {
    input.placeholder = "Name missing";
  }
}

//Clears the leaderboards table before it is loaded again
function clearTable() {
  if (table.rows.length > 1) {
    var temp = json.length;
    for (var i = 1; i < temp; i++) {
      table.deleteRow(1);
    }
  }
}

//Fills the leaderboards table with names and scores
function fillTable() {
  for (var i = 0; i < json.length * 2; i += 2) {
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = json[i];
    cell2.innerHTML = json[i + 1];
  }
}

/*Sends and receives leaderboards data to and from
  connector.php which connects with database */
function sendAndReceive() {
  var xhr = new XMLHttpRequest();
    var url = "connector.php";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        json = JSON.parse(xhr.responseText);
      }
    };
    var data = JSON.stringify({"name": name, "score": score});
    xhr.send(data);
    score = 0;
    name = "";
}

//Controls the speed of the asteroids based on how many times the game() function has run
function velocityController(functionCounter, velocity) {
  if (functionCounter % 5 == 0 && velocity < 500 && functionCounter < 4000)
    velocity += 1;

  if (functionCounter >= 4000 && functionCounter < 5500 && functionCounter % 5 == 0)
    velocity -= 1;

  if (functionCounter >= 5500 && functionCounter < 8000 && functionCounter % 5 == 0 && velocity < 450)
    velocity += 1;

  if (functionCounter >= 8000 && functionCounter < 9000 && functionCounter % 5 == 0)
    velocity -= 1;

  if (functionCounter >= 9000 && functionCounter < 11000 && functionCounter % 5 == 0 && velocity < 400)
    velocity += 1;

  if (functionCounter >= 14000 && functionCounter % 10 == 0 && velocity < 500)
    velocity += 1;

  if (functionCounter >= 16000 && functionCounter < 18000 && functionCounter % 5 == 0)
    velocity -= 1;

  if (functionCounter >= 18000 && functionCounter % 10 == 0 && velocity < 500)
    velocity += 1;

  return velocity;
}

//Controls the density of the asteroids based on how many times the game() function has run
function densityController(functionCounter, density) {
  if (functionCounter >= 5000)
    density = 2;

  if (functionCounter >= 8500)
    density = 3;

  if (functionCounter >= 17500)
    density = 4;

  return density;
}

//Resets the game to its starting state
function reset() {
  drawGameBackground();
  menuClick.play();
  crashed = false;

  ufoX = 400;
  ufoY = 230;

  score = 0;
  velocity = 0;
  density = 1;

  functionCounter = 0;
  asteroidCount = 0;

  for (var i = 0; i < activeAsteroids.length; i++) {
    activeAsteroids[i] = 0;
  }

  menuButton.style.display = "none";
  submitButton.style.display = "none";
  replayButton.style.display = "none";
  playButton.style.display = "none";
  leaderboardsButton.style.display = "none";
  creditsButton.style.display = "none";
  leaderboardsFromGameButton.style.display = "none";
  menuFromGameButton.style.display = "none";
  input.style.display = "none";
  submitted.style.display = "none";

  game();
}

//The core of the game. Controls all movement and interactions of the UFO and asteroids.
function game() {
  currentScreen = 0;
  menuMusicController();
  asteroidCount = 0;
  ctx.drawImage(ufo, ufoX, ufoY, 126, 54);

  if (crashed == false) {
    for (var i = 0; i < activeAsteroids.length; i++) { //Check how many active asteroids are on the screen
      if (activeAsteroids[i] == 1)
        asteroidCount += 1;
    }
    if (asteroidCount == 0) { //If there are no active asteroids on the screen
      if (functionCounter > 1) {
        score += density; //Increment the score by the number of asteroids that have moved off the screen
        scoreSound.play();
      }

      for (var j = 0; j < density; j++) {
        sideSelector[j] = Math.floor(Math.random() * 8); //Randomly select a side/corner to spawn an asteroid from
        while (sideSelector[j] == sideSelector[j - 1] //Ensure that asteroids don't spawn from the same side/corner
        || sideSelector[j] == sideSelector[j - 2]
        || sideSelector[j] == sideSelector[j - 3])
          sideSelector[j] = Math.floor(Math.random() * 8);

        asteroidSelector = Math.random() * 2; //Randomly select an asteroid image
        x[0] = -240;
        x[1] = -240;
        x[2] = Math.random() * 640;
        x[3] = 800;
        x[4] = 800;
        x[5] = 800;
        x[6] = Math.random() * 640;
        x[7] = -240;
        y[0] = Math.random() * 440;
        y[1] = -240;
        y[2] = -240;
        y[3] = -240;
        y[4] = Math.random() * 440;
        y[5] = 600;
        y[6] = 600;
        y[7] = 600;

        for (var i = 0; i <= 7; i++) { //For each possible side
          if (sideSelector[j] == i) { //If the side selector chose this side
            if (asteroidSelector < 1.75) { //If the asteroid selector chose image 1
              ctx.drawImage(asteroid, x[i], y[i]); //Spawn image 1 at specified x and y coordinates
              activeAsteroids[i * 2] = 1; //Indicate that image 1 with position i is active
            }
            else { //If the asteroid selector chose image 2
              ctx.drawImage(asteroid2, x[i], y[i]); //Spawn image 2 at specified x and y coordinates
              activeAsteroids[i * 2 + 1] = 1; //Indicate that image 2 with position i is active
            }
          }
        }
      }
    }
    else { //If there is an asteroid on the screen
      for (var i = 0; i <= 7; i++) {
        if (activeAsteroids[i * 2] == 1) { //If the asteroid is of image 1
          x[i] += moveX[i] * velocity / 50; //Move it relative to the velocity
          y[i] += moveY[i] * velocity / 50;
          ctx.drawImage(asteroid, x[i], y[i]);

          if (ufoX + 100 > x[i] //right side of ufo collides with left side of asteroid
          && ufoY + 45 > y[i] //bottom of ufo collides with top of asteroid
          && x[i] + 100 > ufoX //right side of asteroid collides with left side of ufo
          && y[i] + 110 > ufoY) //bottom of asteroid collides with top of ufo
            crashed = true;
        }

        if (activeAsteroids[i * 2 + 1] == 1) { //If the asteroid is of image 2
          x[i] += moveX[i] * velocity / 50;
          y[i] += moveY[i] * velocity / 50;
          ctx.drawImage(asteroid2, x[i], y[i]);

          if (ufoX + 100 > x[i] //right side of ufo collides with left side of asteroid
          && ufoY + 45 > y[i] //bottom of ufo collides with top of asteroid
          && x[i] + 180 > ufoX //right side of asteroid collides with left side of ufo
          && y[i] + 190 > ufoY) //bottom of asteroid collides with top of ufo
            crashed = true;
        }

        if (x[i] > 800 || x[i] < -240 || y[i] < -240 || y[i] > 600) { //If the asteroid has been moved all the way off the screen
          activeAsteroids[i * 2] = 0; //Indicate that the asteroid is no longer active
          activeAsteroids[i * 2 + 1] = 0;
        }
      }
    }
  }
  else { //Stop the game and ask the user what to do next (submit score, play again, return to menu)
    crashSound.play();
    menuFromGameButton.style.display = "block";
    submitButton.style.display = "block";
    replayButton.style.display = "block";
    input.style.display = "block";

    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 273, 195);
    ctx.font = "25px Arial";
    ctx.fillText("Your Score: " + score, 320, 250);
    return;
  }

  velocity = velocityController(functionCounter, velocity);

  density = densityController(functionCounter, density);

  functionCounter++;

  ctx.fillStyle = "white";
  ctx.font = "25px Arial";
  ctx.fillText("Score: " + score, 300, 30);
  ctx.fillText("Velocity: " + velocity + " km/h", 300, 60);
  ctx.fillText("Density: " + density, 300, 90);

  requestAnimationFrame(game); //Run the game() function on loop until user crashes
}

menu(); //Open main menu on startup
