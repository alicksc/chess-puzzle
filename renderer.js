document.addEventListener("DOMContentLoaded", () => {
  const board = Chessboard('board', {
    position: 'start',
    draggable: true,
    dropOffBoard: 'snapback',  // pieces return if dropped off board
    pieceTheme: ''
  });

  // Optional: Connect to chess.js for rules
  const game = new Chess();

  // You can now make moves, e.g.:
  // game.move("e4");
  // board.position(game.fen());
});