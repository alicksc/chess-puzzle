import { Chess } from '../libs/chess.js';

// Constants
const PUZZLE_PATH = '../puzzles/puzzles-easy.json';
const DEFAULT_THEME = 'libs/pieces/default/{piece}.svg'

// Initialize variables
var board = null;
var game = null;
var solutionMoves = [];
var moveIndex = 0;
var playerColor = 'white';


/**
 * Loads random puzzle in from JSON file
 * @param {string} path - Path to easy puzzles JSON file
 * @returns {object} - A single puzzle object
 */
async function loadRandomPuzzle(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to fetch puzzles: ${response.statusText}`);

  const puzzles = await response.json();
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}


/**
 * Initializes the random puzzle and chess logic
 * @param {object} puzzle - The puzzle object
 */
function initializeGame(puzzle) {
  game = new Chess(puzzle.fen);

  // Save puzzle moves solution
  solutionMoves = puzzle.moves;

  // Reset move tracker
  moveIndex = 0;

  // Determine player color using FEN
  if(puzzle.fen.includes('w')) {
    playerColor = 'white';
  } else if(puzzle.fen.includes('b')){
    playerColor = 'black'
  }
}


/**
 * Initializes visual chess board using Chessboard.js
 * @param {object} puzzle - The puzzle object
 */
function initializeBoard(puzzle) {
  board = Chessboard('board', {
    draggable: true,
    position: puzzle.fen,
    orientation: playerColor,
    pieceTheme: DEFAULT_THEME,
    onDragStart,
    onDrop,
    onSnapEnd
  });
}





/**
 * Prevent moving when it's not player's turn
 * @param {*} source 
 * @param {*} piece 
 * @returns 
 */
function onDragStart(source, piece) {
  if (game.isGameOver()) return false;
  if ((game.turn() === 'w' && piece.startsWith('b')) ||
      (game.turn() === 'b' && piece.startsWith('w'))) return false;
}


/**
 * User plays a move
 * @param {*} source 
 * @param {*} target 
 * @returns 
 */
function onDrop(source, target) {
  if (source === target) return;

  const expected = solutionMoves[moveIndex];
  const actual = source + target;

  // Check if player has made the correct move
  if(actual !== expected) return 'snapback';

  // Player move
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'    // default promotion to queen here
  })

  moveIndex++;
  board.position(game.fen());
  updateStatus;

  // Check if puzzle is complete
  if(moveIndex >= solutionMoves.length) {
    alert('Puzzle complete!');
    return;
  }

  // Play opponent move
  // autoMove();
}


// Sync board after animation
function onSnapEnd() {
  board.position(game.fen());
}



/**
 * Auto-play opponents move
 * @returns 
 */
// function autoPlayMove() {
//   if (moveIndex >= solutionMoves.length) return;

//   const opponentMove = solutionMoves[moveIndex];
//   const move = game.move({
//     from: opponentMove.slice(0, 2),
//     to: opponentMove.slice(2, 4),
//     promotion: 'q',
//   });

//   if (move) {
//     moveIndex++;
//     board.position(game.fen());
//     updateStatus();
//   }
// }


/**
 * Update game status
 */
function updateStatus() {
  let status = '';
  const moveColor = game.turn() === 'w' ? 'White' : 'Black';

  if (game.isCheckmate()) {
    status = `Game over — ${moveColor} is in checkmate.`;
  } else if (game.isDraw()) {
    status = 'Game over — drawn position.';
  } else {
    status = `${moveColor} to move.`;
    if (game.isCheck()) status += ` ${moveColor} is in check.`;
  }

  // Optional: display in <div id="status">
  const statusDiv = document.getElementById('status');
  if (statusDiv) statusDiv.textContent = status;
  else console.log(status);
}






// Main entry point for app
async function main() {
  try {
    const puzzle = await loadRandomPuzzle(PUZZLE_PATH);
    initializeGame(puzzle);
    initializeBoard(puzzle);
    updateStatus();
  } catch (error) {
    console.error("Failed to initialize puzzle: ", error)
  }
}

main();


