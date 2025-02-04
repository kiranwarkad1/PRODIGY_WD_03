const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetButton = document.querySelector('#reset');
const pvpButton = document.querySelector('#pvp');
const pvcButton = document.querySelector('#pvc');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let mode = 'pvp'; // Default mode: Player vs Player

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize the game
function initializeGame() {
  cells.forEach(cell => cell.textContent = '');
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => cell.classList.remove('player1', 'player2', 'win'));
}

// Handle cell click
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive) return;

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer === 'X' ? 'player1' : 'player2');

  if (checkWin()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    highlightWinningLine();
    gameActive = false;
    return;
  }

  if (gameState.every(cell => cell !== '')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (mode === 'pvc' && currentPlayer === 'O') {
    computerMove();
  }
}

// Check for a win
function checkWin() {
  return winningConditions.some(condition => {
    return condition.every(index => {
      return gameState[index] === currentPlayer;
    });
  });
}

// Highlight the winning line
function highlightWinningLine() {
  const winningLine = winningConditions.find(condition => {
    return condition.every(index => {
      return gameState[index] === currentPlayer;
    });
  });

  if (winningLine) {
    winningLine.forEach(index => {
      cells[index].classList.add('win');
    });
  }
}

// Computer's move (random)
function computerMove() {
  let availableCells = gameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  gameState[randomCell] = 'O';
  cells[randomCell].textContent = 'O';
  cells[randomCell].classList.add('player2');

  if (checkWin()) {
    statusText.textContent = 'Computer wins!';
    highlightWinningLine();
    gameActive = false;
    return;
  }

  if (gameState.every(cell => cell !== '')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', initializeGame);
pvpButton.addEventListener('click', () => {
  mode = 'pvp';
  initializeGame();
});
pvcButton.addEventListener('click', () => {
  mode = 'pvc';
  initializeGame();
});

// Start the game
initializeGame();
