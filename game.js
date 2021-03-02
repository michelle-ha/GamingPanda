const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d")
canvas.width = 1000; //determined on css file. Can do window.innerHight/innerWidth if want full screen. Norm: 800x500
canvas.height = 500

const keys = []
const enemies = []
let numberOfEnemies = 10

let score = 0
let livesLost = 0
let time = 0

//PLAYER

const playerSprite = new Image()
playerSprite.src = "./images/panda2.png" 

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH) 
    //takes in the image + cuts out a portion of that image (one sprite frame). Places somewhere on canvas
    //s = source (how you crop the image), d = destination (where you want to put image)
}

const player = {
    x: 500, //starting position
    y: 300,
    width: 48, //depends on sprite sheet. highlight over image to get dimensions. 144x192. x/(# columns). Include decimals
    height: 48, //y/(# rows)
    frameX: 0, //changes what picture you're getting. 
    frameY: 0, 
    speed: 5, 
    moving: false //swith between standing + walking
}

window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true //every time key is pressed, added to keys array
    player.moving = true
})

window.addEventListener("keyup", function(e) {
    delete keys[e.keyCode] //removes key from keys array
    player.moving = false
})

function movePlayer() { //NOTE: CHANGE MARGINS WHEN WE PUT IN VICTIMS
    if (keys[38] && player.y > 0) { //38 = up arrow on keyboard. Prevents player from moving off-screen
        player.y -= player.speed //moves in negative direction along y axis (moves up)
        player.frameY = 3 //character's position changes so it looks like he'ss facing away
        player.moving = true //to prevent characters from "gliding"
    }
    if (keys[37] && player.x > 0) { //37 = left arrow on keyboard. Prevents player from moving off-screen
        player.x -= player.speed //moves left on screen
        player.frameY = 1 //character's position changes so it looks like he's facing left
        player.moving = true
    }
    if (keys[40] && player.y < canvas.height - player.height) { //40 = down
        player.y += player.speed //moves left on screen
        player.frameY = 0 //character's position changes so it looks like he's facing left
        player.moving = true
    }
    if (keys[39] && player.x < canvas.width - player.width) { //39 = right
        player.x += player.speed 
        player.frameY = 2 
        player.moving = true
    }
}

function handlePlayerFrame() { //walking animation
    if (player.frameX < 2 && player.moving) player.frameX++ //grid is 3x4. Check player.moving so legs aren't moving while standing
    else player.frameX = 0
    
}

//ENEMY
const enemySprite = new Image()
enemySprite.src = "./images/death_scythe.png"

class Enemy {
    constructor(){
        this.width = 50
        this.height = 48
        this.frameX = 0
        this.frameY = 1
        this.x = canvas.width
        this.y = Math.random() * ((canvas.height - 100) - 100) + 100 //make so it doesn't go below/above wanted margins
        this.speed = (Math.random()*1.5) + 2
        this.health = 100
        this.maxHealth = this.health
    }
    draw() {
        drawEnemy(enemySprite, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) //change "enemy" to "this.". Change uppercase to lowercase to match constructor variables
        //animate
        // if (this.frameX < this.maxFrame) this.frameX++; //standing to walking
        // else this.frameX = this.minFrame //no hardcoded number in case the animation frame amounts are dif depending on action
    }
    update() {
        this.x -= this.speed //enemies will walk to left
    }
}

for (i = 0; i < numberOfEnemies; i++) { //creates more characters
    enemies.push(new Enemy())
}

function drawEnemy(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
}



//GAMEBOARD
const controlsBar = { //bar on top of game w/ controls/score/etc
    width: canvas.width,
    height: 100
}

//GAME STATUS

function GameStatus() { //displays amount of resources on controlsbar
    ctx.fillStyle = "blue"
    ctx.font = "25px Arial"
    ctx.fillText('Score: ' + score, 30, 40);
    ctx.fillText('Lives lost: ' + livesLost, 30, 90);
    ctx.fillText('Time: ' + time, 880, 40);
}

// function gameStatus() {

// }


//FUNCTIONALITY

//lower frame rate of game to control player speed (so doesn't blink in and out). Keep consistent fsp rate 
let fps, fpsInterval, startTime, now, then, elapsed;  

function startAnimating(fps) { //controls speed of char
    fpsInterval = 1000/fps // value in miliseconds
    then = Date.now() //# of miliseconds elapsed 
    startTime = then
    animate()
}

function animate() {
    requestAnimationFrame(animate)
    now = Date.now()
    elapsed = now - then
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval) 
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear everything behind w/ every animate
        GameStatus()
        ctx.fillStyle = "rgba(0, 181, 204, 0.2)" //call "ctx" because that's where all canvas methods are stored
        ctx.fillRect(0,0, controlsBar.width, controlsBar.height) //(0,0) = top left corner of canvas
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height) 
        //crop rectangle of one player frame + put in same dimensions on canvas. 
        //Where the image is cropped changes depending on position
        movePlayer()
        handlePlayerFrame()
        for (i = 0; i < enemies.length; i ++) {
            enemies[i].draw() //referencing data we pushed into the enemies array
            enemies[i].update()
            // if (enemies[i])
        }
    }
}

startAnimating(30) //arg = fps




window.addEventListener("resize", function() { //keeps the characters from getting re-sized with window size changes
    canvas.width = 1000
    canvas.height = 500
})