import { Chess } from '../libs/chess.js';
import puzzles from '../puzzles/puzzles-easy.json';

// Initialize board and game
var board = null;
var game = new Chess();

// Get random puzzle from list
const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

// Get puzzle solution
const solutionMoves = puzzle.Moves.split(' ');

function onDragStart(source, piece, position, orientation) {
  if(game.isGameOver()) return false;

  if((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}
  
let moveIndex = 0;

function onDrop(source, target) {
  if (source === target) return;

  const expectedMove = solutionMoves[moveIndex];
  const actualMove = source + target;

  // Check if correct move was played
  if (actualMove !== expectedMove) {
    return 'snapback';
  }

  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  // Continue to next move if there is any
  moveIndex++;

  updateStatus();

  // If puzzle is solved, finished
  if (moveIndex >= solutionMoves.length) {
    alert("Puzzle complete!");
  }
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

// Initialize chess game with puzzle FEN
game = new Chess(puzzle.FEN);

// Initialize new chess game
board = Chessboard('board', {
  draggable: true,
  position: puzzle.FEN,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: 'libs/pieces/default/{piece}.svg'
});

updateStatus();