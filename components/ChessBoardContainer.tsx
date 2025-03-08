import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import GameControls from './GameControls';

interface ChessBoardContainerProps {
  gameId: string;
  role: 'white' | 'black';
}

export default function ChessBoardContainer({ gameId, role }: ChessBoardContainerProps) {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [cpuSide, setCpuSide] = useState<'white' | 'black' | null>(null);

  useEffect(() => {
    // Load or sync game state from server if needed
  }, [gameId]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    // If CPU controls the side, block user move
    if (cpuSide === role) {
      return false;
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });

    if (!move) {
      return false;
    }

    setFen(game.fen());

    // If you have a CPU and it's now their turn, trigger AI logic here
    // e.g. setTimeout to ask Stockfish for a move

    // If it's a real 2-player game, broadcast move to server:
    // socket.emit('move', { gameId, move });

    return true;
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={role === 'white' ? 'white' : 'black'}
        arePiecesDraggable={true}
      />
      <GameControls game={game} fen={fen} cpuSide={cpuSide} setCpuSide={setCpuSide} />
    </div>
  );
}
