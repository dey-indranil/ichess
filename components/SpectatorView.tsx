import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

interface SpectatorViewProps {
  gameId: string;
}

export default function SpectatorView({ gameId }: SpectatorViewProps) {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());

  useEffect(() => {
    // Subscribe to changes for gameId if needed
    // For each new move: game.move(...); setFen(game.fen());
  }, [gameId]);

  return (
    <div>
      <p>You are watching game {gameId} as a spectator.</p>
      <Chessboard position={fen} arePiecesDraggable={false} />
    </div>
  );
}
