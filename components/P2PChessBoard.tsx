import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { sendData, setOnMessageCallback } from './WebRTCConnection';

interface Props {
  localColor: 'white' | 'black';
  useCPU: boolean;
}

export default function P2PChessBoard({ localColor, useCPU }: Props) {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [turnColor, setTurnColor] = useState<'white' | 'black'>('white');
  const [errorMessage, setErrorMessage] = useState('');

  // If CPU is on, CPU is the opposite color
  const cpuSide = useCPU ? (localColor === 'white' ? 'black' : 'white') : null;

  // Setup a callback to handle remote messages (i.e. moves)
  useEffect(() => {
    setOnMessageCallback((msg) => {
      if (msg.type === 'move') {
        const result = game.move(msg.move);
        if (result) {
          setFen(game.fen());
          setTurnColor(game.turn() === 'w' ? 'white' : 'black');
        }
      }
    });
  }, [game]);

  // Clean handler for onDrop with error handling for illegal moves
  function onDrop(sourceSquare: string, targetSquare: string) {
    // Block move if not the local player's turn
    if (turnColor !== localColor) {
      setErrorMessage('Not your turn!');
      setTimeout(() => setErrorMessage(''), 3000);
      return false;
    }

    // If CPU controls localColor, block local move
    if (cpuSide === localColor) {
      setErrorMessage('Move not allowed: CPU in control.');
      setTimeout(() => setErrorMessage(''), 3000);
      return false;
    }

    // Try to make the move
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });
      if (!move) {
        // Illegal move detected, show error and return false
        setErrorMessage('Illegal move!');
        setTimeout(() => setErrorMessage(''), 3000);
        return false;
      }
      // Update board state if move is legal
      setFen(game.fen());
      setTurnColor(game.turn() === 'w' ? 'white' : 'black');
      
      // Broadcast move to remote peer
      sendData({ type: 'move', move: { from: sourceSquare, to: targetSquare, promotion: 'q' } });

      // Optionally, if game is over, show a message
      if (game.isGameOver()) {
        setTimeout(() => alert(getGameOverMessage()), 100);
      }
    } catch (error) {
      console.error('Error during move:', error);
      setErrorMessage('An error occurred, illegal move.');
      setTimeout(() => setErrorMessage(''), 3000);
      return false;
    }

    return true;
  }

  function makeCpuMove() {
    const possibleMoves = game.moves({ verbose: true });
    if (possibleMoves.length === 0) return;

    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    const move = game.move(randomMove);
    setFen(game.fen());
    setTurnColor(game.turn() === 'w' ? 'white' : 'black');

    // Also broadcast the CPU move to the remote
    const moveObj = { from: randomMove.from, to: randomMove.to, promotion: 'q' };
    sendData({ type: 'move', move: moveObj });

    if (game.isGameOver()) {
      setTimeout(() => alert(getGameOverMessage()), 100);
    }
  }

  function getGameOverMessage() {
    if (game.isCheckmate()) {
      return `Checkmate! ${turnColor === 'white' ? 'Black' : 'White'} wins.`;
    }
    if (game.isDraw()) {
      return 'Draw!';
    }
    return 'Game over.';
  }

  function resetBoard() {
    game.reset();
    setFen(game.fen());
    setTurnColor('white');
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={localColor === 'white' ? 'white' : 'black'}
        arePiecesDraggable={true}
        boardWidth={600}
      />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={resetBoard}>Reset</button>
        <p>Current turn: {turnColor}</p>
      </div>
    </div>
  );
}
