const manEl = document.querySelectorAll(".man")
const lettersContainerEl = document.getElementById("letters")
const alphabetEl = document.querySelectorAll(".alphabet-letter")
const mistakesLeftEl = document.getElementById("mistakes-left")
const losingScreenContainer = document.getElementById("losing-screen")
const winningScreenContainer = document.getElementById("winning-screen")
const loseWordRevealEl = document.getElementById('lose-word-reveal')
const winWordRevealEl = document.getElementById('win-word-reveal')
const googleHyperlinkEl = document.querySelectorAll('.google-link')
const restartBtn = document.querySelectorAll('.restart-btn')
let word = ''

console.log(googleHyperlinkEl)
restartBtn.forEach((button) => {
    button.addEventListener('click', beginGame)
})

async function getRandomWord() {
    let wordResponse = await fetch("https://random-word-api.herokuapp.com/word?number=1")
    let wordData = await wordResponse.json()
    console.log(wordData[0])
    return wordData[0].toUpperCase()
}

async function beginGame() {
    while (lettersContainerEl.firstChild) {
        lettersContainerEl.removeChild(lettersContainerEl.firstChild)
    }

    word = await getRandomWord()
    manEl.forEach((manPart) => {
        manPart.classList.remove('show')
    })

    resetLetters(word)
    
    alphabetEl.forEach((letter) => {
        letter.classList.remove('selected')
        letter.removeEventListener('click', alphabetSelect)
        letter.addEventListener('click', alphabetSelect, {once: true})
    })

    mistakesLeftEl.innerText = 7
    losingScreenContainer.classList.remove('show')
    winningScreenContainer.classList.remove('show')

    googleHyperlinkEl.forEach(link => {
        link.href = ''
        link.innerText = ''
    })
    
}

function alphabetSelect(event) {
    let letterGuessEl = event.target
    letterGuessEl.classList.add('selected')
    let guess = letterGuessEl.innerText
    let wordSpaces = document.querySelectorAll('.letter')
    let guessRight = false
    for (let i = 0; i < word.length; i++) {
        if (guess === word[i]) {
            wordSpaces[i].innerText = guess
            wordSpaces[i].classList.add('filled')
            guessRight = true
        }
    };
    
    if (guessRight === false && mistakesLeftEl.innerText == 1){
        googleHyperlinkEl[0].innerText = word
        googleHyperlinkEl[0].href = `https://www.google.com/search?q=${word}`
        losingScreenContainer.classList.add('show')
        mistakesLeftEl.innerText -= 1
        manEl[0].classList.add('show')
    } else if (guessRight === false) {
        mistakesLeftEl.innerText -= 1
        manEl[mistakesLeftEl.innerText].classList.add('show')
    } else if (document.querySelectorAll('.filled').length === word.length) {
        googleHyperlinkEl[1].innerText = word
        googleHyperlinkEl[1].href = `https://www.google.com/search?q=${word}`
        winningScreenContainer.classList.add('show')
    }
}

function resetLetters(word) {

    for (let i = 0; i < word.length; i++) {
        let letterEl = document.createElement('div')
        letterEl.classList.add('letter')
        lettersContainerEl.append(letterEl)
    }
}

beginGame()