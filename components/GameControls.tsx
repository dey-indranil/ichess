import { ChessInstance } from 'chess.js';

interface GameControlsProps {
  game: ChessInstance;
  fen: string;
  cpuSide: 'white' | 'black' | null;
  setCpuSide: React.Dispatch<React.SetStateAction<'white' | 'black' | null>>;
}

export default function GameControls({ game, fen, cpuSide, setCpuSide }: GameControlsProps) {
  const resetBoard = () => {
    game.reset();
  };

  const handleCPU = (side: 'white' | 'black') => {
    if (cpuSide === side) {
      setCpuSide(null);
    } else {
      setCpuSide(side);
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <button onClick={resetBoard}>Reset Game</button>
      <button onClick={() => handleCPU('white')}>
        CPU as White {cpuSide === 'white' ? '(ON)' : '(OFF)'}
      </button>
      <button onClick={() => handleCPU('black')}>
        CPU as Black {cpuSide === 'black' ? '(ON)' : '(OFF)'}
      </button>
      <p>FEN: {fen}</p>
    </div>
  );
}
