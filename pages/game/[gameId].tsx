import { useRouter } from 'next/router';
import ChessBoardContainer from '../../components/ChessBoardContainer';
import SpectatorView from '../../components/SpectatorView';
import { useEffect, useState } from 'react';

export default function GamePage() {
  const router = useRouter();
  const { gameId, cpu } = router.query;

  // role = 'white' or 'black' or 'spectator'.
  const [role, setRole] = useState<'white' | 'black' | 'spectator'>('spectator');

  useEffect(() => {
    if (cpu === 'true') {
      // If user specifically created a CPU match, let’s make them White by default.
      setRole('white');
    } else {
      // For PVP, we might set the user as white or black from server logic, or default to White
      setRole('white');
    }
  }, [cpu]);

  if (!gameId) {
    return <div>Loading game...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Game: {gameId}</h2>
      {role === 'spectator' ? (
        <SpectatorView gameId={gameId as string} />
      ) : (
        <ChessBoardContainer
          gameId={gameId as string}
          role={role}
          isCPU={cpu === 'true'}
        />
      )}
    </div>
  );
}
