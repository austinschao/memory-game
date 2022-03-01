"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */
/**Create a function to create a random # */
function randomNumber(max) {
  let num = Math.floor(Math.random() * max);
  while (num % 2 !== 0) {
    num = Math.floor(Math.random() * max);
  }
  return num;
}
  /** Create a random equal # up to max cards */
// const randomDeck = randomNumber(21) + 10;
/** Modify the colors arr to take in two of the same random colors until it reaches the # random cards made */
/** RGB colors up to 255 */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [];

while (COLORS.length < 20) {
  let randomColor;
  randomColor = `rgb(${randomNumber(256)},${randomNumber(256)},${randomNumber(256)})`;
  COLORS.push(randomColor, randomColor);
}

const colors = shuffle(COLORS);

createCards(colors);



/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const card = document.createElement('div');
    card.classList.add(color, 'card');
    card.addEventListener('click', handleCardClick);
    gameBoard.append(card);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.target.style.backgroundColor = card.target.classList[0];
  card.target.classList.add('flipped');
}

/** Flip a card face-down. */

function unFlipCard(card) {
  setTimeout(() => {
    card.style.backgroundColor = "";
    card.classList.remove('flipped');

  }, FOUND_MATCH_WAIT_MSECS);
}

/** Handle clicking on a card: this could be first-card or second-card. */


function handleCardClick(evt) {
  let flippedCards = document.querySelectorAll('.flipped');
  if (startGame === false) {
    alert("Start the game!")
  } else if (flippedCards.length < 2) {
    flipCard(evt);
  }

  flippedCards = document.querySelectorAll('.flipped');

  if (flippedCards.length === 2) {
    matches(flippedCards);
  }

  if (document.querySelectorAll('.matched').length === colors.length) {
    stop();
    /** Save score to the local storage */
    localStorage.setItem(`${player}`, `${document.querySelector('#timer').innerHTML}`);
    setTimeout(() => {
      alert(`You won the game in ${document.querySelector('#timer').innerHTML} seconds. Thanks for playing :D`);
    }, 500);
    /** Display the highest score */
    compareScores();
    
  }
}
//write in the code above to check if they made it into the leaderboard, if so prompt name, if not try again
// const name = prompt('You made it into the leaderboard! Enter your name:');


/** Check if the two flipped cards match */ 

function matches(flippedCards) {
  if (flippedCards[0].style.backgroundColor === flippedCards[1].style.backgroundColor) {
    flippedCards[0].classList.remove('flipped');
    flippedCards[0].classList.add('matched');
    flippedCards[0].removeEventListener('click', handleCardClick);
    flippedCards[1].classList.remove('flipped');
    flippedCards[1].classList.add('matched');
    flippedCards[1].removeEventListener('click', handleCardClick);
    flippedCards[0].style.backgroundImage = 'none';
    flippedCards[1].style.backgroundImage = 'none';
  } else {
    unFlipCard(flippedCards[0]);
    unFlipCard(flippedCards[1]);
  }
}

/** Must click on start button before cards can be clicked */

const startBtn = document.querySelector('#start-btn');
const invalidStartBtn = startBtn.cloneNode(true);

let startGame = false;

startBtn.addEventListener('click', (e) => {
  startGame = true;
  startBtn.parentNode.replaceChild(invalidStartBtn, startBtn);
});

/** Must click on restart button to reset the game */
function resetGame() {
  stop();
  document.querySelector('#timer').innerHTML = 0;

  document.querySelectorAll('.card').forEach(card => {
    card.remove();
  });

  invalidStartBtn.remove();
  document.querySelector('#btn-container').prepend(startBtn);


  const colors = shuffle(COLORS);
  createCards(colors);
 
  startGame = false;
}


const restartBtn = document.querySelector('#restart-btn');
restartBtn.addEventListener('click', resetGame);

/** Create a timer to keep track of score */
startBtn.addEventListener('click', startTimer);


function changeTimer() {
  document.querySelector('#timer').innerHTML++;
}

let timerInterval;

function startTimer() {
  stop();
  timerInterval = setInterval(changeTimer, 1000);
}

function stop() {
  clearInterval(timerInterval);
}

/** Enter player name when they want to start game */
let player;
startBtn.addEventListener('click', () => {
  player = window.prompt('Please enter your name before you begin the game');
  while (player === null || player == '') {
    player = window.prompt('Please enter your name before you begin the game');
  }
})

/** Create a function to compare scores and store the highest */
let bestPlayer = 'Computer'
let bestScore = 100;
function compareScores() {

  for (let i = 0; i < localStorage.length; i++) {
    if (parseInt(localStorage.getItem(localStorage.key(i))) <= bestScore) {
      bestPlayer = localStorage.key(i);
      bestScore = parseInt(localStorage.getItem(localStorage.key(i)));
    }
  }

  document.querySelector('td').innerHTML = `${bestPlayer}: ${bestScore} seconds`;
}

