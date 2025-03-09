import { useState } from 'react';
import WebRTCConnection from '../components/WebRTCConnection';
import P2PChessBoard from '../components/P2PChessBoard';

// Import the new CSS module
import styles from '../styles/P2P.module.css';

export default function P2PPage() {
  // 'localColor' is which side this user is playing
  const [localColor, setLocalColor] = useState<'white' | 'black'>('white');
  // Simple toggle for optional CPU – if you want to let the user also fight an AI
  const [useCPU, setUseCPU] = useState(false);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>P2P Chess (No Dedicated Server)</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: 8 }}>Local Color:</label>
        <select
          value={localColor}
          onChange={(e) => setLocalColor(e.target.value as 'white' | 'black')}
        >
          <option value="white">White</option>
          <option value="black">Black</option>
        </select>

        <label style={{ marginLeft: 16, marginRight: 8 }}>Play vs CPU?</label>
        <input
          type="checkbox"
          checked={useCPU}
          onChange={(e) => setUseCPU(e.target.checked)}
        />
      </div>

      {/* WebRTC manual signaling UI */}
      <WebRTCConnection />

      {/* The actual chessboard + logic that uses the DataChannel */}
      <P2PChessBoard localColor={localColor} useCPU={useCPU} />
    </div>
  );
}
