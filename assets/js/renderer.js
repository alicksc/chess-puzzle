import { Chess } from '../libs/chess.js';

// Constants
const PUZZLE_PATH = 'assets/puzzles/puzzles-easy.json';
const DEFAULT_THEME = 'assets/libs/pieces/default/{piece}.svg';

// DOM
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');

// Game State
let board = null;
let game = null;
let solutionMoves = [];
let moveIndex = 0;
let playerColor = 'white';

/**
 * Load a random puzzle from the JSON file.
 */
async function loadRandomPuzzle(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load puzzles: ${res.statusText}`);
  const puzzles = await res.json();
  const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  return randomPuzzle;
}

/**
 * Setup puzzle logic.
 */
function initializeGame(puzzle) {
  game = new Chess(puzzle.fen);
  solutionMoves = puzzle.moves;
  moveIndex = 0;
  playerColor = puzzle.fen.includes('w') ? 'white' : 'black';
}

/**
 * Create the visual board.
 */
function initializeBoard(puzzle) {
  board = Chessboard('board', {
    draggable: true,
    position: puzzle.fen,
    orientation: playerColor,
    pieceTheme: DEFAULT_THEME,
    onDragStart,
    onDrop,
    onSnapEnd,
    onMouseoverSquare,
    onMouseoutSquare
  });
}

/**
 * Only allow moving your own pieces.
 */
function onDragStart(source, piece) {
  if (game.isGameOver()) return false;
  if ((game.turn() === 'w' && piece.startsWith('b')) ||
      (game.turn() === 'b' && piece.startsWith('w'))) return false;
}

/**
 * Handle player move.
 */
function onDrop(source, target) {
  if (source === target) return;

  const expected = solutionMoves[moveIndex];
  const actual = source + target;

  if (actual !== expected) return 'snapback';

  const move = game.move({ from: source, to: target, promotion: 'q' });
  if (!move) return 'snapback';

  moveIndex++;
  board.position(game.fen());
  highlightMove(source, target);
  updateStatus();

  if (moveIndex >= solutionMoves.length) {
    alert("Puzzle complete!");
    return;
  }

  // You can enable auto-move here later if needed
}

/**
 * Sync board to internal game state.
 */
function onSnapEnd() {
  board.position(game.fen());
}

/**
 * Show legal target squares on hover.
 */
function onMouseoverSquare(square, piece) {
  const moves = game.moves({ square, verbose: true });
  if (!moves.length) return;

  moves.forEach(move => {
    const sq = boardEl.querySelector(`.square-${move.to}`);
    if (sq) sq.classList.add('square-available');
  });
}

/**
 * Clear highlight when mouse leaves.
 */
function onMouseoutSquare(square, piece) {
  boardEl.querySelectorAll('.square-available').forEach(el => {
    el.classList.remove('square-available');
  });
}

/**
 * Highlight the move from `from` to `to`.
 */
function highlightMove(from, to) {
  // Clear previous highlights
  boardEl.querySelectorAll('.square-highlight').forEach(el => {
    el.classList.remove('square-highlight');
  });

  const fromEl = boardEl.querySelector(`.square-${from}`);
  const toEl = boardEl.querySelector(`.square-${to}`);

  if (fromEl) fromEl.classList.add('square-highlight');
  if (toEl) toEl.classList.add('square-highlight');
}

/**
 * Display the game status (turn, check, etc.)
 */
function updateStatus() {
  let status = '';
  const moveColor = game.turn() === 'w' ? 'White' : 'Black';

  if (game.isCheckmate()) {
    status = `Game over — ${moveColor} is in checkmate.`;
  } else if (game.isDraw()) {
    status = 'Game over — Draw.';
  } else {
    status = `${moveColor} to move.`;
    if (game.isCheck()) status += ` ${moveColor} is in check.`;
  }

  if (statusEl) statusEl.textContent = status;
  else console.log(status);
}

/**
 * App entry point.
 */
async function main() {
  try {
    const puzzle = await loadRandomPuzzle(PUZZLE_PATH);
    initializeGame(puzzle);
    initializeBoard(puzzle);
    updateStatus();
  } catch (err) {
    console.error("Initialization failed:", err);
  }
}

main();