const menu = document.getElementById('menu');
const game = document.getElementById('game');
const levelButtons = document.querySelectorAll('#level-buttons button');
const levelTitle = document.getElementById('level-title');
const board = document.getElementById('game-board');
const status = document.getElementById('status');
const nextLevelBtn = document.getElementById('next-level-btn');
const restartBtn = document.getElementById('restart-btn');
const backMenuBtn = document.getElementById('back-menu-btn');

const allSymbols = ['🍎', '🍌', '🍇', '🍓', '🍉', '🥝', '🍍', '🥥', '🍒', '🍑', '🍋', '🥭']; 
// 12 symboles max pour jouer les niveaux les plus élevés

let currentLevel = 1;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let canClick = true;

// Fonction de mélange Fisher-Yates
function shuffle(array) {
  for(let i = array.length -1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Retourner au menu
backMenuBtn.onclick = () => {
  game.style.display = 'none';
  menu.style.display = 'block';
  status.textContent = '';
  nextLevelBtn.style.display = 'none';
}

// Démarrer un niveau
function startLevel(level) {
  currentLevel = level;
  menu.style.display = 'none';
  game.style.display = 'block';
  nextLevelBtn.style.display = 'none';
  status.textContent = 'Trouve toutes les paires !';
  levelTitle.textContent = `Niveau ${level}`;

  // Le nombre de paires augmente avec le niveau
  // Par ex : niveau 1 = 4 paires, niveau 6 = 12 paires
  let pairsCount = 4 + (level - 1) * 2;
  if(pairsCount > allSymbols.length) pairsCount = allSymbols.length;

  const selectedSymbols = allSymbols.slice(0, pairsCount);
  cards = shuffle([...selectedSymbols, ...selectedSymbols]); // paires mélangées
  flippedCards = [];
  matchedPairs = 0;
  canClick = true;

  renderBoard();
}

// Créer le plateau avec les cartes
function renderBoard() {
  board.innerHTML = '';
  cards.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;

    card.addEventListener('click', () => onCardClicked(card));
    board.appendChild(card);
  });
}

function onCardClicked(card) {
  if(!canClick) return;
  if(card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if(flippedCards.length === 2) {
    canClick = false;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if(card1.dataset.symbol === card2.dataset.symbol) {
    matchedPairs++;
    flippedCards = [];
    canClick = true;
    status.textContent = `Bonne paire ! (${matchedPairs} / ${cards.length/2})`;

    if(matchedPairs === cards.length/2) {
      status.textContent = '🎉 Bravo, niveau terminé ! 🎉';
      if(currentLevel < 6) {
        nextLevelBtn.style.display = 'inline-block';
      }
    }
  } else {
    status.textContent = 'Raté... Essaie encore.';
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      canClick = true;
      status.textContent = 'Trouve toutes les paires !';
    }, 1000);
  }
}

nextLevelBtn.onclick = () => {
  if(currentLevel < 6) startLevel(currentLevel + 1);
  nextLevelBtn.style.display = 'none';
}

restartBtn.onclick = () => {
  startLevel(currentLevel);
}

// Gestion des boutons de niveau dans le menu
levelButtons.forEach(button => {
  button.addEventListener('click', () => {
    const lvl = parseInt(button.dataset.level);
    startLevel(lvl);
  });
});
