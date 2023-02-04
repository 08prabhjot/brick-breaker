var startModal = document.getElementById('startModal')
var startGame = document.querySelector('.play-text')
var topScore = document.querySelector('.top-score-text')

startGame.addEventListener('click', function() {
    startModal.classList.remove('active')
})