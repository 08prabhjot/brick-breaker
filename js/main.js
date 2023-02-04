var startModal = document.getElementById('startModal')
var startGame = document.querySelector('.play-text')
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

startGame.addEventListener('click', function() {
    startModal.classList.remove('active')
})

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