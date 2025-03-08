import { useRouter } from 'next/router';
import ChessBoardContainer from '../../components/ChessBoardContainer';
import SpectatorView from '../../components/SpectatorView';
import { useEffect, useState } from 'react';

export default function GamePage() {
  const router = useRouter();
  const { gameId } = router.query;
  const [role, setRole] = useState<'white' | 'black' | 'spectator'>('spectator');

  useEffect(() => {
    // Logic to determine user role (white, black, or spectator)
    // e.g., from query param, user login, or server check
    // For now, leave it as 'spectator'
  }, []);

  if (!gameId) {
    return <div>Loading game...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Game: {gameId}</h2>
      {role === 'spectator' ? (
        <SpectatorView gameId={gameId as string} />
      ) : (
        <ChessBoardContainer gameId={gameId as string} role={role} />
      )}
    </div>
  );
}
