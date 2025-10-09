import { Chess } from './libs/chess.js';

document.addEventListener("DOMContentLoaded", () => {
  const board = Chessboard('board', {
    position: 'start',
    draggable: true,
    dropOffBoard: 'snapback',  // pieces return if dropped off board
    pieceTheme: 'libs/pieces/default/{piece}.svg',
    onDrop: (source, target) => {
        const move = game.move({ from: source, to: target});

        if(move === null) return 'snapback';   // checks for illegal moves

        // Updates UI to match game logic
        board.position(game.fen(), true);
    }
  });

  // Optional: Connect to chess.js for rules
  const game = new Chess();

});