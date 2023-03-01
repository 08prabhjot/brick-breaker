// Links of references
//https://www.youtube.com/watch?v=PVXwmom3Q8s
//https://www.youtube.com/watch?v=oy5QVxzOk6k
// https://github.com/untitled-team-101/Bricks-Breaker - Refer only to the core parts of the game such as pad control,
//ball movement, collision handling. After that, I will develop the game according to my own ideas
import {storeScore, getScore} from './firebase.js'

var startModal = document.getElementById('startModal')
var startGameBtn = document.querySelector('.play-text')
var topScore = document.querySelector('.top-score-text')
var pad = document.querySelector(".pad");
var ball = document.querySelector(".ball");
var bricks = document.querySelectorAll(".brick")
var mainContainer = document.getElementById("gameBoard")
var lives = document.getElementById('lives')
var preBtn = document.querySelector('.control .btn-prev')
var nextBtn = document.querySelector('.control .btn-next')
var skipBtn = document.querySelector('.skip .btn-skip')
var notifyModal = document.querySelector('.modal-notify')
var btnRestartLevel = notifyModal.querySelector('.again') 
var btnEnterName = document.querySelector('.enter-name')


// CONFIG VALUE
let gameRunning = 0;
let ballTop = 0
let ballLeft = 0
let ballMoveDelay = 5;
let padCollisionPoint = 0;
let maxLives = 10;
let startLives = 2;
let ballsLife = maxLives;
let timerId = 0;
let totalScore = 0
let ballsDirection = {
    left: 0,
    top: 0
}
let movementPhysics = 40 // Movement speed of pad on keyboard controls
let score = 0 //SCORE ONLY IN A LEVEL
let username = ''

startGameBtn.addEventListener('click', function() {
    startModal.classList.remove('active')
    mainContainer.classList.remove('hide')
    mainContainer.style.setProperty("--ball-top", pad.offsetTop - ball.offsetHeight)
})
lives.textContent = startLives // SET DEFAULT LIVES

//https://www.youtube.com/watch?v=PVXwmom3Q8s  - See how move the pad
mainContainer.addEventListener("mousemove", (event) => { //TRIGGER EVENT MOUSE MOVE FOR MOVE PAD
    let padLeft = event.offsetX // Mouse position in the game area
    if(padLeft < 0 || padLeft > event.target.offsetWidth - pad.offsetWidth) return //Stop moving the pad when the mouse is out of the control area

    //Set the position of the pad by updating the value of the variable in CSS
    mainContainer.style.setProperty("--pad-left", padLeft.toString())
    if (gameRunning === 0) { // IF THE GAME DOESN'T RUN, THE BALL WILL MOVE BY THE PAD
        ballLeft = padLeft + pad.offsetWidth / 2 - ball.offsetWidth / 2
        //Set the position of the ball by updating the value of the variable in CSS
        mainContainer.style.setProperty("--ball-left", ballLeft.toString())
    }
})

window.addEventListener('keydown', (event) => { //TRIGGER EVENT KEY DOWN FOR MOVE PAD
    let padLeft = parseInt(mainContainer.style.getPropertyValue('--pad-left')) // GET CSS VARIABLE AND PARSE TO INT
    if(event.key == "ArrowLeft") {
        padLeft -= movementPhysics
    }
    if(event.key == "ArrowRight") {
        padLeft += movementPhysics
    }

    if(event.key == 'ArrowUp') {
        if (gameRunning === 0) {
            gameRunning = 1;
            startGame();
        }
    }

    if (padLeft < 0)
        return
    if (padLeft > mainContainer.offsetWidth - pad.offsetWidth)
        return

    if (gameRunning === 0) {
        ballLeft = padLeft + pad.offsetWidth / 2 - ball.offsetWidth / 2
        //Set the position of the ball by updating the value of the variable in CSS
        mainContainer.style.setProperty("--ball-left", ballLeft.toString())
    }
    //Set the position of the pad by updating the value of the variable in CSS
    mainContainer.style.setProperty("--pad-left", padLeft.toString())
})

mainContainer.addEventListener("click", (event) => { // START GAME WHEN CLICK ON GAME AREA
    if (gameRunning === 0) {
        gameRunning = 1;
        startGame();
    }
})

const startBallMove = () => {
    ballTop = pad.offsetTop - ball.offsetHeight;
    ballsDirection = {
        left: 0,
        top: -3
    }
}

const startGame = () => {
    startBallMove();
    timerId = setInterval(moveBall, ballMoveDelay)
}

const moveBall = () => {
    ballTop += ballsDirection.top;
    ballLeft += ballsDirection.left;
    mainContainer.style.setProperty("--ball-left", ballLeft.toString())
    mainContainer.style.setProperty("--ball-top", ballTop.toString())
    checkCollision()
}

const checkCollision = () => {
    checkBrickCollision()
    checkWallCollision()
    checkPadCollision()
}

let ignoreBrickCollision = false
const checkBrickCollision = () => {
    if (ignoreBrickCollision)
        return
    for (let brick of bricks) {
    
        if (ignoreBrickCollision)
            return
        if (brick.classList.contains("broken"))
            continue

        let collision = getCollisionBetween(ball, brick)

        if (!collision)
            continue

        onCollisionWithBrick(ball, brick, collision);
        ignoreBrickCollision = true
        setTimeout(() => {
            ignoreBrickCollision = false
        }, ballMoveDelay * 2)

        if (collision === "rtl" || collision === "ltr")
            ballsDirection.left *= -1
        if (collision === "ttb" || collision === "btt")
            ballsDirection.top *= -1
    }
}

// https://www.youtube.com/watch?v=oy5QVxzOk6k - See how handle collisions
const getCollisionBetween = (element1, element2) => {
    let left1 = element1.offsetLeft
    let left2 = element2.offsetLeft
    let top1 = element1.offsetTop
    let top2 = element2.offsetTop

    let right1 = left1 + element1.offsetWidth
    let right2 = left2 + element2.offsetWidth
    let bottom1 = top1 + element1.offsetHeight
    let bottom2 = top2 + element2.offsetHeight

    if (right1 > left2 && right1 < right2) {
        if (bottom1 > top2 && bottom1 < bottom2) {
            if (bottom1 - top2 > right1 - left2) {
                console.log("left to right")
                return "ltr"
            } else {
                console.log("top to bottom")
                return "ttb"
            }
        }
        if (top1 < bottom2 && top1 > top2) {

            if (top1 - bottom2 > right1 - left2) {
                console.log("left to right")
                return "ltr"
            } else {
                console.log("bot to top")
                return "btt"
            }
        }
    }
    if (left1 < right2 && left1 > left2) {
        if (bottom1 > top2 && bottom1 < bottom2) {
            if (bottom1 - top2 > right2 - left1) {
                console.log("right to left")
                return "rtl"
            } else {
                console.log("top to bottom")
                return "ttb"
            }
        }
        if (top1 < bottom2 && top1 > top2) {
            if (top1 - bottom2 > right2 - left1) {
                console.log("right to left")
                return "rtl"
            } else {
                console.log("bottom to top")
                return "btt"
            }
        }
    }
    return false
}

const onCollisionWithBrick = (ball, brick, collision) => {
    totalScore += 100
    score += 100
    document.getElementById("score").innerText = totalScore.toString()
    brick.classList.add('broken')
    checkStatus('win')
}

const checkWallCollision = () => {
    if (ballLeft > mainContainer.offsetWidth - ball.offsetWidth - 1)
        ballsDirection.left *= -1
    if (ballLeft < 1)
        ballsDirection.left *= -1
    if (ballTop < 1)
        ballsDirection.top *= -1
    if (ballTop > mainContainer.offsetHeight - ball.offsetWidth - 1) {
        //BALL DROPED
        startLives = startLives - 1
        lives.textContent = startLives
        clearInterval(timerId)
        if(startLives) {
            gameRunning = 0
            ballTop = pad.offsetTop - ball.offsetHeight;
            ballLeft = pad.offsetLeft + pad.offsetWidth / 2 - ball.offsetWidth / 2;
            mainContainer.style.setProperty("--ball-left", ballLeft.toString())
            mainContainer.style.setProperty("--ball-top", ballTop.toString())
        } else {
            //WHEN LOSE
            checkStatus('lose')
        }
    }
}

const checkPadCollision = () => {
    if (getCollisionBetween(ball, pad)) {
        padCollisionPoint = ball.offsetLeft + ball.offsetWidth / 2;
        if (padCollisionPoint < (pad.offsetLeft + pad.offsetWidth / 4)) {
            ballsDirection.top = -2
        } else if (padCollisionPoint < (pad.offsetLeft + pad.offsetWidth / 2)) {
            ballsDirection.left = -2
        } else if (padCollisionPoint >= (pad.offsetLeft + pad.offsetWidth / 2) && padCollisionPoint < (pad.offsetLeft + pad.offsetWidth / 4 * 3)) {
            ballsDirection.left = 2
        } else {
            ballsDirection.top = -2
        }
        while (ballTop + ball.offsetHeight > pad.offsetTop)
            ballTop--
    }
}

function controlIntro(type) {
    let currentSlide = document.querySelector('.intro .item.active')
    let indexSlide = currentSlide.getAttribute('index')
    let nextIndexSlide =  type == 'next' ? parseInt(indexSlide) + 1 : parseInt(indexSlide) - 1 //SET NEXT INDEX BY TYPE
    let maxSlide = document.querySelectorAll('.intro .item').length //GET ALL SLIDE, PARSE IT TO ARRAY AND GET LENGTH

    if(nextIndexSlide < 1) return // BREAK WHEN NEXT INDEX OUT RANGE SLIDES INDEX
    if(nextIndexSlide > maxSlide) { // END INTRO WHEN AT LAST SLIDE
        document.querySelector('.intro').classList.add('hide')
        startModal.classList.add('active')
    }
    
    currentSlide.classList.remove('active') //HIDE CURRENT SLIDE
    let nextSlide = document.querySelector(`.intro .item[index="${nextIndexSlide}"]`) //GET NEXT SLIDE HAVE INDEX = NEXT INDEX
    nextSlide.classList.add('active') // SET ACTIVE NEXT SLIDE
}

preBtn.addEventListener('click', () => controlIntro('prev'))
nextBtn.addEventListener('click', () => controlIntro('next'))
skipBtn.addEventListener('click', function(event) {
    event.preventDefault()
    document.querySelector('.intro').classList.add('hide')
    startModal.classList.add('active')
})

function checkWinning() {
    let brick = document.querySelector('.brick:not(.broken)')
    if(!brick) {
        notifyModal.classList.remove('hide')
        notifyModal.querySelector('.score').textContent = score
        notifyModal.querySelector('.total-score').textContent = totalScore
        clearInterval(timerId)
        gameRunning = 0
    }
}

function checkStatus(type) {
    if(type == 'win') checkWinning()
    else {
        notifyModal.classList.remove('hide')
        notifyModal.querySelector('.modal-body').classList.add('lose')
        notifyModal.querySelector('.title').textContent = "YOU LOSE"
        notifyModal.querySelector('.score').textContent = score
        notifyModal.querySelector('.total-score').textContent = totalScore
        gameRunning = 0
        storeScore(username, totalScore)
    }
}

function restartLevel(level = 1) { //DEFAULT RESTART TO FIRST LEVEL
    score = 0
    totalScore = 0
    startLives = 2
    notifyModal.classList.add('hide')
    for (let brick of bricks) {
        brick.classList.remove('broken')
    }
    mainContainer.style.setProperty("--ball-top", pad.offsetTop - ball.offsetHeight)
    document.getElementById("score").innerText = totalScore.toString()
    lives.textContent = startLives
}

btnRestartLevel.addEventListener('click', function() {
    restartLevel()
})


btnEnterName.addEventListener('click', function() {
    let name = document.querySelector('#name').value
    username = name
    document.querySelector('.username').textContent = name
    document.querySelector('.intro').classList.remove('hide')
    document.querySelector('.info-start').classList.add('hide')
})

getScore()