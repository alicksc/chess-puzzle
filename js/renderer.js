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

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: 'libs/pieces/default/{piece}.svg'
}  

board = Chessboard('board', config);

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
