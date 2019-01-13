const screenWidth = window.innerWidth - 20;
const screenHeigth = window.innerHeight - 20;

var p5 = new p5();

const velocity = 8;
const gravitation = 4;


let flappyBirdImg = p5.loadImage('./resources/bird.png'),
    backgroundImg = p5.loadImage('./resources/background.png'),
    pipe = p5.loadImage('./resources/pipe.png'),
    flippedPipe = p5.loadImage('./resources/pipeFlipped.png'),

    pipes = [],
    numberOfPipes = 0,
    points = 0,
    birdYCoordonates = screenHeigth / 2,
    birdWidthConstant = 70,
    gameOver = false,
    gameOverAlerted = false;
birdHeightConstat = 50;


if (screenWidth <= 780 || screenHeigth <= 500) {
    alert("Be aware this game is not made for phones or any low resolution devices!");
}

startGeneratePipes(Math.floor((screenWidth / 0.9)));

function isGameOver() {
    if (birdYCoordonates > screenHeigth || birdYCoordonates <= 0) {
        gameOver = true;
        alert("game over!");
        gameOver = false;
        drawBirdOnInitialState();
    }
}

function pipeWasTouched() {
    if (!gameOverAlerted) {
        gameOverAlerted = true;
        alert("game over!");
        location.reload();
    }
}

function drawBackground() {
    background(backgroundImg);
}

function startGeneratePipes(interval) {
    pipeGenerator();
    setInterval(pipeGenerator, interval);
}

function drawBirdOnInitialState() {
    birdYCoordonates = screenHeigth / 2;
    drawBirdByY(screenHeigth / 2);
}

function drawBirdByY(y) {
    image(flappyBirdImg,
        screenWidth / 10,
        y,
        flappyBirdImg.width / screenWidth * birdWidthConstant,
        flappyBirdImg.height / screenHeigth * birdHeightConstat);
}

function birdFallDown() {
    if (!gameOver) {
        birdYCoordonates += (screenHeigth * gravitation) / screenHeigth * 1.4; // 1.5
        drawBirdByY(birdYCoordonates);
    }
}

function birdJump() {
    if (!gameOver) {
        birdYCoordonates -= (screenHeigth * gravitation) / screenHeigth * 40; //40
        drawBirdByY(birdYCoordonates);
    }
}

function detectSpacePress() {
    document.body.onkeyup = function (e) {
        if (e.keyCode == 32) {
            birdJump();
        }
    }
}

function drawPipes(xCoordonate, heightOfDownPipe, heightOfUpPipe) {
    heightOfDownPipe += 20;
    heightOfUpPipe += 20;
    xCoordonate -= 20;
    drawDownSidePipe(xCoordonate, screenHeigth - heightOfDownPipe, heightOfDownPipe);
    drawUpsidePipe(xCoordonate, -20, heightOfUpPipe);
}

function drawDownSidePipe(x, y, pipeHeight) {
    image(pipe, x, y, 100, pipeHeight);
}

function drawUpsidePipe(x, y, pipeHeight) {
    image(flippedPipe, x, y, 100, pipeHeight);
}

function pipeMovement(index) {
    pipes[index].pipeXCoordonate -= velocity;
    drawPipes(pipes[index].pipeXCoordonate, pipes[index].heightOfDownPipe, pipes[index].heightOfUpPipe);
    checkBirdColission(pipes[index].heightOfDownPipe, pipes[index].heightOfUpPipe, pipes[index].pipeXCoordonate);
}

function pipeGenerator() {
    numberOfPipes++;
    let heights = generateHeights();
    let heightOfDownPipe = heights[0];
    let heigtOfUpPipe = heights[1];
    if (pipes.length - 1 <= numberOfPipes) {
        pipes.push({
            pipeXCoordonate: screenWidth,
            heightOfDownPipe: heightOfDownPipe,
            heightOfUpPipe: heigtOfUpPipe
        })
    }
}

function generateHeights() {
    let max = Math.floor(screenHeigth / 3),
        min = 20,
        crossingSpace = Math.floor(screenHeigth / 2.3),
        upPipe = Math.floor(Math.random() * (max - min + 1) + min),
        downPipe = screenHeigth - crossingSpace - upPipe;
    return [downPipe, upPipe];
}


function checkBirdColission(maxPointOfDownPipe, maxPointOfUpPipe, pipeXCoordonates) {
    let birdXCoordonates = Math.floor(screenWidth / 10);
    let contor = 100; //depends of the width of the pipe
    for (let birdAproxNums = birdXCoordonates - contor + 10; birdAproxNums < birdXCoordonates + contor; birdAproxNums++) {
        if (birdAproxNums === pipeXCoordonates &&
            (birdYCoordonates <= maxPointOfUpPipe ||
                birdYCoordonates >= screenHeigth - maxPointOfDownPipe - 50)) {
            pipeWasTouched();
        }
    }
    checkPoints(pipeXCoordonates, birdXCoordonates);
}

function checkPoints(pipeXCoordonates, birdXCoordonates) {
    let pointsContor = 5;
    for (let pipeXAporxNums = pipeXCoordonates - pointsContor; pipeXAporxNums <= pipeXCoordonates + pointsContor; pipeXAporxNums++) {
        if (birdXCoordonates == pipeXAporxNums) {
            points++;
        }
    }
}

function pipesIteration() {
    for (let i = 0; i < pipes.length; i++) {
        if (pipes[i].pipeXCoordonate >= 0) {
            pipeMovement(i);
        } else {
            numberOfPipes--;
            pipes.shift();
        }
    }
}

function drawPoints() {
    noStroke();
    fill(255);
    textSize(20);
    text("Points: " + points, screenWidth - 100, 20);
}

function displayAuthor() {
    noStroke();
    fill(255);
    textSize(13);
    text("Made By: Vasilache Andrei", 10, 20);
    text("Click for details", 10, 35);
    if (mouseIsPressed) {
        window.location.href = "http://vasilache-andrei.herokuapp.com";
    }
}

function setup() {
    createCanvas(screenWidth, screenHeigth);
}


function draw() {
    drawBackground();
    birdFallDown();
    pipesIteration();
    detectSpacePress();
    isGameOver();
    drawPoints();
    displayAuthor();
}