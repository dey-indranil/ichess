import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LobbyList from '../components/LobbyList';
import styles from '../styles/Lobby.module.css';

export default function LobbyPage() {
  const router = useRouter();

  const [gameList, setGameList] = useState<string[]>([]);

  // Example: fetch or subscribe to get the list of active games
  useEffect(() => {
    // setGameList(['game123', 'game456']);
  }, []);

  // This function could call a backend to create a new game and
  // store the game mode (PVP vs CPU). For now, we’ll hardcode.
  const createGame = async (mode: 'pvp' | 'cpu') => {
    // e.g., an API call: const res = await fetch('/api/create-game', { method: 'POST', body: JSON.stringify({ mode })})
    // const newGameId = await res.json();
    const newGameId = 'generated-id'; // placeholder

    // If CPU game, we could pass a query param or store in DB that the user is playing vs. CPU
    const isCPU = mode === 'cpu';

    // Use Next.js router to navigate instead of window.location
    router.push(`/game/${newGameId}?cpu=${isCPU}`);
  };

  return (
    <div className={styles.lobbyContainer}>
      <h1>Welcome to My Chess App</h1>
      <button onClick={() => createGame('pvp')} className={styles.createGameButton}>
        Player vs. Player
      </button>
      <button onClick={() => createGame('cpu')} className={styles.createGameButton}>
        Player vs. CPU
      </button>
      <button onClick={() => router.push('/p2p')} className={styles.createGameButton}>
        P2P Mode (No Server)
      </button>

      <LobbyList games={gameList} />
    </div>
  );
}
