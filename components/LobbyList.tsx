import Link from 'next/link';
import styles from '../styles/Lobby.module.css';

interface LobbyListProps {
  games: string[];
}

export default function LobbyList({ games }: LobbyListProps) {
  return (
    <ul className={styles.lobbyList}>
      {games.map((gameId) => (
        <li key={gameId} className={styles.lobbyItem}>
          <Link href={`/game/${gameId}`}>Join Game {gameId}</Link>
        </li>
      ))}
    </ul>
  );
}
