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
var topScoreBoard = document.querySelector('.top-score')
var closeScoreBoard = document.querySelector('.btn-close-score')
var btnBackToHome = document.querySelector('.menu')
var containerBricks = document.querySelector('.bricks')
var nextLevel = document.querySelector('button.next')
var btnSelectBall = document.querySelectorAll('.select-ball')
var btnSelectPad = document.querySelectorAll('.select-pad')
var btnRestartGame = notifyModal.querySelector('.restart') 
var buyItem = document.querySelectorAll('.buy-item')

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
let currentLevel = 1
let scoreEach = 100
const levelList = [ //DEFINE LEVELS IN GAME
    {brick: 3, brick_2: 1, brick_3: 0},
    {brick: 6, brick_2: 0, brick_3: 0},
    {brick: 8, brick_2: 2, brick_3: 0},
    {brick: 7, brick_2: 7, brick_3: 0},
    {brick: 3, brick_2: 9, brick_3: 2},
    {brick: 3, brick_2: 6, brick_3: 5},
    {brick: 3, brick_2: 3, brick_3: 8},
    {brick: 2, brick_2: 3, brick_3: 10},
    {brick: 8, brick_2: 4, brick_3: 6},
    {brick: 4, brick_2: 8, brick_3: 10},
]
let speed = 1
let balanceCoin = 0

startGameBtn.addEventListener('click', function() {
    startModal.classList.remove('active')
    mainContainer.classList.remove('hide')
    mainContainer.style.setProperty("--ball-top", pad.offsetTop - ball.offsetHeight)
    generateBricks(1)
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
    ballTop += ballsDirection.top * speed;
    ballLeft += ballsDirection.left * speed;
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
    totalScore += scoreEach
    score += scoreEach
    document.getElementById("score").innerText = totalScore.toString()
    let brickClassList = [...brick.classList].filter(item => { //CONVERT DOMList to Array
        return item.match(/brick_[2-9]/) //ONLY GET CLASS MATCH WITH FORMAT `brick_{2->9}`, ex: brick_3
    })
    if(brickClassList.length && !ball.classList.contains('super')) { // IF BRICK IS NOT LOWEST LEVEL OR BALL IS NOT POWER
        let splitClass = brickClassList[0].split('_') // CONVERT STRING TO ARRAY WITH SEPARATED BY COMMA _ 
        let nextBrickType = splitClass[1] - 1; // DOWNGRADE LEVEL OF BRICK
        if(nextBrickType > 0) { // IF BRICK IS NOT LOWEST LEVEL, SET NEW LEVEL FOR IT
            brick.classList.add('brick_' + nextBrickType)
        }
        brick.classList.remove(brickClassList[0]) //REMOVE OLD LEVEL
    } else {
        brick.classList.add('broken')
        randomItems()
    }
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
            ballsDirection.left = -2
            ballsDirection.top = -2
        } else if (padCollisionPoint < (pad.offsetLeft + pad.offsetWidth / 2)) {
            ballsDirection.left = -1
            ballsDirection.top = -3
        } else if (padCollisionPoint >= (pad.offsetLeft + pad.offsetWidth / 2) && padCollisionPoint < (pad.offsetLeft + (pad.offsetWidth / 4) * 3)) {
            ballsDirection.left = 1
            ballsDirection.top = -3
        } else {
            ballsDirection.left = 2
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
        let dropItem = document.querySelectorAll('.drop-item')
        if(dropItem) {
            //REMOVE ALL DROP ITEM WHEN END LEVEL
            dropItem.forEach(item => {
                item.remove()
            })
        }
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
        let dropItem = document.querySelectorAll('.drop-item')
        if(dropItem) {
            //REMOVE ALL DROP ITEM WHEN END LEVEL
            dropItem.forEach(item => {
                item.remove()
            })
        }
        storeScore(username, totalScore)
    }
}

function restartLevel(level = 1) { //DEFAULT RESTART TO FIRST LEVEL
    notifyModal.querySelector('.modal-body').classList.remove('lose')
    totalScore -= score
    if(totalScore <=0) totalScore = 0
    score = 0
    startLives = 2
    notifyModal.classList.add('hide')
    generateBricks(level)
    mainContainer.style.setProperty("--ball-top", pad.offsetTop - ball.offsetHeight)
    document.getElementById("score").innerText = totalScore.toString()
    lives.textContent = startLives
}

function nextLevelLevel(level = 1) {
    score = 0
    startLives = 2
    notifyModal.classList.add('hide')
    for (let brick of bricks) {
        brick.remove()
    }
    generateBricks(level) //REMOVE OLD BRICKS AND GENERATE NEW BRICKS
    mainContainer.style.setProperty("--ball-top", pad.offsetTop - ball.offsetHeight)
    document.getElementById("score").innerText = totalScore.toString()
    lives.textContent = startLives
}

btnRestartLevel.addEventListener('click', function() {
    restartLevel(currentLevel)
})

btnRestartGame.addEventListener('click', function() {
    score = 0
    startLives = 2
    totalScore = 0
    restartLevel(1)
})

btnBackToHome.addEventListener('click', function() {
    restartLevel()
    startModal.classList.add('active')
})


btnEnterName.addEventListener('click', function() {
    let name = document.querySelector('#name').value
    username = name
    document.querySelector('.username').textContent = name
    document.querySelector('.intro').classList.remove('hide')
    document.querySelector('.info-start').classList.add('hide')
})

getScore()

topScore.addEventListener('click', function() {
    topScoreBoard.classList.remove('hide')
})

closeScoreBoard.addEventListener('click', function() {
    topScoreBoard.classList.add('hide')
})

function generateBricks(level) {
    bricks = document.querySelectorAll(".brick")
    bricks.forEach(item => {
        item.remove()
    })
    let levelGame = Object.assign({}, levelList[level-1]) //Copy out a new object so as not to affect the corner object
    let listBrickType = Object.keys(levelGame).filter(key => { // CONVERT OBJECT TO ARRAY AND ONLY GET TYPES IF AMOUNT OF IT > 0
        return levelGame[key]
    })
    let totalBrick = Object.values(levelGame).reduce((a, b) => a + b, 0) //CONVERT OBJECT TO ARRAY FOR SUM TOTAL BRICK
    do {
        let brick = document.createElement('div')
        brick.classList.add('brick')
        let randomBrick = Math.ceil(Math.random()*(listBrickType.length-1)) //RANDOM INDEX OF BRICK TYPE IN LIST TYPE 
        let type = listBrickType[randomBrick] //Get brick type from list type
        if(levelGame[type] <= 0) { //Remove this type if this type has reached its limit
            listBrickType.splice(listBrickType.indexOf(type),1)
            randomBrick = Math.ceil(Math.random()*(listBrickType.length-1))
            type = listBrickType[randomBrick] //Get brick type from list type
        }
        brick.classList.add(type) //Add class to brick
        containerBricks.append(brick) // Add brick to container bricks
        levelGame[type] -= 1; //Reduce the number of brick types after creating
        totalBrick -= 1; //Reduce the total number of brick after creating
    } while(totalBrick)
    bricks = document.querySelectorAll(".brick") //GET LIST BRICKS AGAIN
}

nextLevel.addEventListener('click', () => {
    currentLevel += 1 //SET NEXT LEVEL
    nextLevelLevel(currentLevel)
})

btnSelectBall.forEach(btn => {
    btn.addEventListener('click', function() {
        btnSelectBall.forEach(item => {
            item.classList.remove('active') //REMOVE ALL SELECTED BALL BEFORE SELECT NEW BALL
        })
        let ball = btn.getAttribute('ball')
        btn.classList.add('active') //SET ACTIVE NEW BALL
        document.querySelector('.ball').style.backgroundImage = `url('../../img/${ball}')` // CHANGE BACKGROUND OF BALL
    })
})

btnSelectPad.forEach(btn => {
    btn.addEventListener('click', function() {
        btnSelectPad.forEach(item => {
            item.classList.remove('active') //REMOVE ALL SELECTED PAD BEFORE SELECT NEW PAD
        })
        let ball = btn.getAttribute('pad')
        btn.classList.add('active') //SET ACTIVE NEW PAD
        document.querySelector('.pad').style.backgroundImage = `url('../../img/${ball}')` // CHANGE BACKGROUND OF BALL
    })
})

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


const listItems = [
    {name: 'power', image: 'supper_ball.png', effect: 'power', time: 5000},
    {name: 'increase_width', image: 'increase_width.png', effect: 'increase_width', time: 5000},
    {name: 'reduce_width', image: 'reduce_width.png', effect: 'reduce_width', time: 5000},
    {name: 'heart_add', image: 'heart.png', effect: 'heart_add', time: 5000},
    {name: 'heart_reduce', image: 'heart-minus.png', effect: 'heart_reduce', time: 5000},
    {name: 'double_point', image: 'point.png', effect: 'double_point', time: 5000},
    {name: 'slow', image: 'slow.png', effect: 'slow', time: 5000},
    {name: 'speed', image: 'speed.png', effect: 'speed', time: 5000},
    {name: 'coin', image: 'coin.png', effect: 'coin', time: 5000},
]

function randomItems() {
    let number = randomNumber(1,5)
    if(number) {
        let item = document.createElement('div')
        item.classList.add('drop-item')

        let getItem = Object.assign({}, listItems[listItems.length - 1])
        let position = randomNumber(1,100) //RANDOM POSITION TO START DROP ITEM
        let propertyName = '--item-top-'+ Date.now() // CREATE NEW PROPERTY FOR EACH ITEM
        mainContainer.style.setProperty(propertyName, "0") //SET PROPERTY POSITION START AT TOP 0
        item.style.top = `calc(var(${propertyName}) * 1px)` //APPLY POSITION TO ITEM
        item.style.left = position + '%' //SET POSITION TO ITEM
        item.style.backgroundImage = `url(../../img/${getItem.image})`
        mainContainer.append(item) //APPEND ITEM TO MAIN SCREEN

        let itemTop = 0;
        let dropItemInterval = setInterval(() => {
            itemTop += 0.5
            mainContainer.style.setProperty(propertyName, itemTop.toString()) //INCREASE VALUE OF TOP PROPERTY
           
            if(getCollisionBetween(item, pad) || (itemTop > mainContainer.offsetHeight - item.offsetWidth - 1)) { // CHECK IF GET ITEM SUCCESSFULY OR DROP OUT RANGE
                if(getCollisionBetween(item, pad)) {
                    applyEffect(getItem)
                }
                item.remove() //REMOVE ITEM
                clearInterval(dropItemInterval)
            }
        }, 5)
    }
}

function applyEffect(item) {
    switch (item.effect) {
        case 'power':
            ball.classList.add('super')
            let superTimeout = setTimeout(() => {
                ball.classList.remove('super')
                clearTimeout(superTimeout)
            }, item.time)
            break;
        case 'increase_width':
            pad.classList.add('increase')
            pad.classList.remove('reduce')
            let increaseTimeout = setTimeout(() => {
                pad.classList.remove('increase')
                clearTimeout(increaseTimeout)
            }, item.time)
            break;
        case 'reduce_width':
            pad.classList.add('reduce')
            pad.classList.remove('increase')
            let reduceTimeout = setTimeout(() => {
                pad.classList.remove('reduce')
                clearTimeout(reduceTimeout)
            }, item.time)
            break;
        case 'heart_add':
            startLives = startLives + 1
            lives.textContent = startLives
            break;
        case 'heart_reduce':
            startLives = startLives - 1
            lives.textContent = startLives
            break;
        case 'double_point':
            scoreEach = 200
            let doubleTimeout = setTimeout(() => {
                scoreEach = 100
                clearTimeout(doubleTimeout)
            }, item.time)
            break;
        case 'slow':
            speed = .5
            let slowTimeout = setTimeout(() => {
                speed = 1
                clearTimeout(slowTimeout)
            }, item.time)
            break;
        case 'speed':
            speed = 2
            let speedTimeout = setTimeout(() => {
                speed = 1
                clearTimeout(speedTimeout)
            }, item.time)
            break;
        case 'coin':
            balanceCoin += 2
            break;
        default:
            break;
    }
}

buyItem.forEach(btn => {
    btn.addEventListener('click', () => {
        let itemBuy = btn.getAttribute('item')
        let price = btn.getAttribute('coin')

        if(balanceCoin >= price) {
            balanceCoin -= price
            document.querySelector('.balance').textContent = balanceCoin //BALANCE IN STORE
            document.querySelector('#balance').textContent = balanceCoin //BALANCE AT STATISTIC
        } else {
            alert('Not enough coin!')
        }
    })
})