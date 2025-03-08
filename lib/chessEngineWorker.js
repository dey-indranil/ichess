// Example Web Worker for Stockfish (minimal placeholder).
// In a real app, place a built stockfish.js file or integrate official stockfish WASM.

onmessage = function(e) {
  const { type, fen } = e.data;
  if (type === 'makeMove') {
    // Logic to compute best move
    // For now, just do a random example. (Replace with real Stockfish logic.)
    const moves = ['e2e4','d2d4','g1f3','b1c3'];
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    postMessage({ type: 'aiMove', move: { from: randomMove.slice(0,2), to: randomMove.slice(2,4) } });
  }
};
