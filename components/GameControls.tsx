import { Chess } from 'chess.js';

interface GameControlsProps {
  game: Chess;
  fen: string;
  cpuSide: 'white' | 'black' | null;
}

export default function GameControls({ game, fen, cpuSide }: GameControlsProps) {
  const resetBoard = () => {
    game.reset();
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <button onClick={resetBoard}>Reset Game</button>

      {cpuSide && (
        <p>
          Playing vs. CPU as <b>{cpuSide}</b>
        </p>
      )}

      <p>FEN: {fen}</p>
    </div>
  );
}
