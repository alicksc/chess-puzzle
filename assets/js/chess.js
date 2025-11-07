import { Chess } from '../libs/chess.js';

var board = null;
var game = new Chess();

function onDragStart(source, piece, position, orientation) {
  if(game.isGameOver()) return false;

  if((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop(source, target) {
  if(source === target) return;
  
  var move = game.move({
    from: source,
    to: target,
    verbose: true,
    promotion: 'q'
  });

  if(move === null) return 'snapback';

  updateStatus();
}

function onSnapEnd() {
  board.position(game.fen());
}

function updateStatus() {
  var status = '';

  var moveColor = 'White'
  if(game.turn() === 'b') {
    moveColor = 'Black';
  }

  if(game.isCheckmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  else if(game.isDraw()) {
    status = 'Game over, drawn position';
  }

  else {
    status = moveColor + ' to move';

    if(game.isCheck()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

}

board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: 'libs/pieces/default/{piece}.svg'
}  );

updateStatus();

// document.addEventListener("DOMContentLoaded", () => {
//   // Optional: Connect to chess.js for rules
//   const game = new Chess();
  
//   const board = Chessboard('board', {
//     // game options
//     position: 'start',
//     draggable: true,
//     dropOffBoard: 'snapback',  // pieces return if dropped off board
//     pieceTheme: 'libs/pieces/default/{piece}.svg',

//     onDrop: (source, target) => {
//         const move = game.move({ from: source, to: target, promotion: 'q'});

//         if(move === null) return 'snapback';   // checks for illegal moves

//         // Updates UI to match game logic
//         board.position(game.fen(), true);
//     },
    
//     onSnapEnd: () => {
//       board.position(game.fen());
//     }
//   });
// });























































// Import dependencies
import { Chess } from '../libs/chess.js';

// Constants & Config
const PUZZLE_PATH = '../puzzles/puzzles-easy.json';
const BOARD_CONTAINER_ID = 'board';
const PIECE_THEME_PATH = 'libs/pieces/default/{piece}.svg';

// State
let board = null;
let game = null;
let solutionMoves = [];
let moveIndex = 0;

/**
 * Main entry point of the application.
 */
async function main() {
  try {
    const puzzle = await loadRandomPuzzle(PUZZLE_PATH);
    initializeGame(puzzle);
    initializeBoard(puzzle);
    updateStatus();
  } catch (error) {
    console.error("Failed to initialize puzzle app:", error);
  }
}

/**
 * Loads a random puzzle from a JSON file.
 * @param {string} path - Path to the JSON puzzle file.
 * @returns {object} - A single puzzle object.
 */
async function loadRandomPuzzle(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to fetch puzzles: ${response.statusText}`);

  const puzzles = await response.json();
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

/**
 * Initializes the chess logic and puzzle state.
 * @param {object} puzzle - The puzzle object.
 */
function initializeGame(puzzle) {
  game = new Chess(puzzle.fen);
  solutionMoves = puzzle.moves;
  moveIndex = 0;
}

/**
 * Initializes the visual board using Chessboard.js.
 * @param {object} puzzle - The puzzle object.
 */
function initializeBoard(puzzle) {
  board = Chessboard(BOARD_CONTAINER_ID, {
    draggable: true,
    position: puzzle.fen,
    pieceTheme: PIECE_THEME_PATH,
    onDragStart,
    onDrop,
    onSnapEnd
  });
}

/**
 * Handles when the user starts dragging a piece.
 */
function onDragStart(source, piece) {
  if (game.isGameOver()) return false;
  if ((game.turn() === 'w' && piece.startsWith('b')) ||
      (game.turn() === 'b' && piece.startsWith('w'))) return false;
}

/**
 * Handles when the user drops a piece on a square.
 */
function onDrop(source, target) {
  if (source === target) return;

  const expected = solutionMoves[moveIndex];
  const actual = source + target;

  if (actual !== expected) return 'snapback';

  const move = game.move({ from: source, to: target, promotion: 'q' });
  if (!move) return 'snapback';

  moveIndex++;
  updateStatus();

  if (moveIndex >= solutionMoves.length) {
    alert("Puzzle complete!");
  }
}

/**
 * Syncs board position with game state after piece snap.
 */
function onSnapEnd() {
  board.position(game.fen());
}

/**
 * Updates puzzle status — e.g., turn info, check, or end of game.
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

  // Optional: Hook into a <div id="status"> element
  console.log(status);
}

// 🚀 Run the app
main();



/* Example of what the JSON data looks like

[{"id":"000o3",
  "fen":"8/2p1k3/6p1/1p1P1p2/1P3P2/3K2Pp/7P/8 b - - 1 43",
  "moves":["e7d6","d3d4","g6g5","f4g5"],"rating":946,
  "themes":["crushing","endgame","pawnEndgame","short","zugzwang"],
  "url":"https://lichess.org/BAY91mF3/black#86"}

*/