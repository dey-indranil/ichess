import { useState, useEffect } from 'react';
import LobbyList from '../components/LobbyList';
import styles from '../styles/Lobby.module.css';

export default function LobbyPage() {
  const [gameList, setGameList] = useState<string[]>([]);

  useEffect(() => {
    // Example: fetch or subscribe to get list of active games
    // setGameList(['game123', 'game456']);
  }, []);

  const createGame = async () => {
    // Normally you'd call an API or a backend service to create a new game
    const newGameId = 'generated-game-id'; // placeholder
    window.location.href = `/game/${newGameId}`;
  };

  return (
    <div className={styles.lobbyContainer}>
      <h1>Welcome to My Chess App</h1>
      <button onClick={createGame} className={styles.createGameButton}>
        Create New Game
      </button>
      <LobbyList games={gameList} />
    </div>
  );
}
