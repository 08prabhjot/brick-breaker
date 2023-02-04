var startModal = document.getElementById('startModal')
var startGameBtn = document.querySelector('.play-text')
var topScore = document.querySelector('.top-score-text')
var pad = document.querySelector(".pad");
var ball = document.querySelector(".ball");
var bricks = document.querySelectorAll(".brick")
var mainContainer = document.getElementById("gameBoard")


// CONFIG VALUE
let gameRunning = 0;
let ballTop = 0
let ballLeft = 0
let ballMoveDelay = 5;
let padCollisionPoint = 0;
let maxLives = 10;
let ballsLife = maxLives;
let timerId = 0;
let totalScore = 0
let ballsDirection = {
    left: 0,
    top: 0
}
let movementPhysics = 40 // Movement speed of pad on keyboard controls

startGameBtn.addEventListener('click', function() {
    startModal.classList.remove('active')
})

mainContainer.style.setProperty("--ball-top", pad.offsetTop - ball.offsetHeight)

mainContainer.addEventListener("mousemove", (event) => {
    let padLeft = event.offsetX
    if(padLeft < 0 || padLeft > event.target.offsetWidth - pad.offsetWidth) return

    mainContainer.style.setProperty("--pad-left", padLeft.toString())
    if (gameRunning === 0) {
        ballLeft = padLeft + pad.offsetWidth / 2 - ball.offsetWidth / 2
        mainContainer.style.setProperty("--ball-left", ballLeft.toString())
    }
})

window.addEventListener('keydown', (event) => {
    let padLeft = +mainContainer.style.getPropertyValue('--pad-left')

    if(event.key == "ArrowLeft") {
        padLeft -= movementPhysics
    }
    if(event.key == "ArrowRight") {
        padLeft += movementPhysics
    }

    if (padLeft < 0)
        return
    if (padLeft > mainContainer.offsetWidth - pad.offsetWidth)
        return

    if (gameRunning === 0) {
        ballLeft = padLeft + pad.offsetWidth / 2 - ball.offsetWidth / 2
        mainContainer.style.setProperty("--ball-left", ballLeft.toString())
    }
    mainContainer.style.setProperty("--pad-left", padLeft.toString())
})

mainContainer.addEventListener("click", (event) => {
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
    return false
}

const onCollisionWithBrick = (ball, brick, collision) => {
    totalScore += 100
    document.getElementById("score").innerText = totalScore.toString()
    brick.classList.add('broken')
}