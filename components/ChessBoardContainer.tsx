import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import GameControls from './GameControls';
// If you have a Stockfish worker or logic, import here
// import engineWorker from '../lib/chessEngineWorker.js';

interface ChessBoardContainerProps {
  gameId: string;
  role: 'white' | 'black';
  isCPU: boolean;
}

export default function ChessBoardContainer({ gameId, role, isCPU }: ChessBoardContainerProps) {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());

  // If playing against CPU, we assume CPU is black. If role === white => user is white
  // If role === black => user is black (maybe you want CPU as white, but let's keep it simple).
  const cpuSide = isCPU ? (role === 'white' ? 'black' : 'white') : null;

  useEffect(() => {
    // Load or sync game state from server if needed
  }, [gameId]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    // If CPU side is the current user's role, block user from moving
    // so user can’t move if it’s the CPU’s turn or the CPU’s color
    if (cpuSide === role) {
      return false;
    }

    // Attempt user move
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });

    if (!move) {
      return false;
    }

    setFen(game.fen());

    // Check for checkmate, etc. (Just a quick example)
    if (game.isGameOver()) {
      alert(`Game Over! ${game.isCheckmate() ? 'Checkmate' : 'Draw'}`);
      return true;
    }

    // If we are in CPU mode and it's now the CPU's turn, request CPU move
    if (cpuSide) {
      const currentTurn = game.turn(); // 'w' or 'b'
      const cpuColor = cpuSide === 'white' ? 'w' : 'b';
      if (currentTurn === cpuColor) {
        makeCpuMove();
      }
    }

    // If it's a 2-player online game, broadcast move to server
    // socket.emit('move', { gameId, move });

    return true;
  }

  // Dummy CPU logic (random move). In a real app, you'd integrate Stockfish, etc.
  function makeCpuMove() {
    // List all legal moves
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) {
      // No moves = game over
      return;
    }
    // Simple random selection of a move
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    game.move(randomMove);
    setFen(game.fen());

    if (game.isGameOver()) {
      alert(`Game Over! ${game.isCheckmate() ? 'Checkmate' : 'Draw'}`);
    }
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={role === 'white' ? 'white' : 'black'}
        arePiecesDraggable={true}
      />
      <GameControls game={game} fen={fen} cpuSide={cpuSide} />
    </div>
  );
}
