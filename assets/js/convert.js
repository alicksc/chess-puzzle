const fs = require('fs');
const csv = require('csv-parser');

const easy = [];
const medium = [];
const hard = [];
const insane = [];
const GM = [];

fs.createReadStream('lichess_db_puzzle.csv')
  .pipe(csv())
  .on('data', (row) => {
    const rating = parseInt(row.Rating);
    const puzzle = {
      id: row.PuzzleId,
      fen: row.FEN,
      moves: row.Moves.split(' '),
      rating,
      themes: row.Themes?.split(' '),
      url: row.GameUrl
    };

    if (rating <= 1000) easy.push(puzzle);
    else if (rating <= 1600) medium.push(puzzle);
    else if (rating <= 2000) hard.push(puzzle);
    else if (rating <= 2400) insane.push(puzzle);
    else GM.push(puzzle);
  })
  .on('end', () => {
    fs.writeFileSync('puzzles-easy.json', JSON.stringify(easy));
    fs.writeFileSync('puzzles-medium.json', JSON.stringify(medium));
    fs.writeFileSync('puzzles-hard.json', JSON.stringify(hard));
    fs.writeFileSync('puzzles-insane.json', JSON.stringify(insane));
    fs.writeFileSync('puzzles-GM.json', JSON.stringify(GM));
    console.log('Puzzles sorted and saved.');
  });