import React, { useRef, useState } from 'react';

// We'll keep references to the RTCPeerConnection & DataChannel
// in module-scope for simplicity. In a real app, you might store them in context or redux.
let peerConnection: RTCPeerConnection | null = null;
let dataChannel: RTCDataChannel | null = null;

// We'll store a reference to any callback that wants to be notified upon receiving data
let onMessageCallback: ((data: any) => void) | null = null;

// Expose a function so other components can listen for messages (i.e., moves)
export function setOnMessageCallback(fn: (data: any) => void) {
  onMessageCallback = fn;
}

// A function to send JSON data over the data channel
export function sendData(message: any) {
  if (dataChannel && dataChannel.readyState === 'open') {
    dataChannel.send(JSON.stringify(message));
  }
}

export default function WebRTCConnection() {
  const [offerSDP, setOfferSDP] = useState('');
  const [answerSDP, setAnswerSDP] = useState('');
  const [status, setStatus] = useState('Disconnected');

  
  // Separate refs: one for "Paste Remote Offer", one for "Paste Remote Answer"
  const remoteOfferRef = useRef<HTMLTextAreaElement>(null);
  const remoteAnswerRef = useRef<HTMLTextAreaElement>(null);

  // Basic ICE configuration with a public STUN server
  // Remove it if you truly want zero external servers (but NAT traversal won't work).
  const configuration: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  async function createOffer() {
    // Initialize
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE state changed to:', peerConnection.iceConnectionState);
      
        if (peerConnection.iceConnectionState === 'connected') {
          console.log('ICE is fully connected. Data channel should be able to open now.');
        }
      };

    // Create data channel for moves
    dataChannel = peerConnection.createDataChannel('movesChannel');

    dataChannel.onopen = () => setStatus('Data channel open');
    dataChannel.onclose = () => setStatus('Data channel closed');
    dataChannel.onerror = (err) => console.error('DataChannel error:', err);

    // When we receive a message from the remote peer
    dataChannel.onmessage = (event) => {
      if (!onMessageCallback) return;
      try {
        const parsed = JSON.parse(event.data);
        onMessageCallback(parsed);
      } catch (e) {
        console.warn('Invalid JSON from remote:', event.data);
      }
    };

    // Once we have the final ICE candidates, setOfferSDP with localDescription
    peerConnection.onicecandidate = (event) => {
      if (!event.candidate && peerConnection?.localDescription) {
        setOfferSDP(peerConnection.localDescription.sdp || '');
      }
    };

    setStatus('Creating offer...');
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  }

  async function setRemoteOffer() {
    if (!peerConnection) {
      // If we're the "answer" side, we might not have created a peerConnection yet.
      peerConnection = new RTCPeerConnection(configuration);
      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE state changed to:', peerConnection.iceConnectionState);
      
        if (peerConnection.iceConnectionState === 'connected') {
          console.log('ICE is fully connected. Data channel should be able to open now.');
        }
      };

      // Wait for remote data channel
      peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        dataChannel.onmessage = (evt) => {
          if (!onMessageCallback) return;
          try {
            const parsed = JSON.parse(evt.data);
            onMessageCallback(parsed);
          } catch (err) {
            console.warn('Invalid JSON from remote:', evt.data);
          }
        };
        dataChannel.onopen = () => setStatus('Data channel open');
        dataChannel.onclose = () => setStatus('Data channel closed');
      };

      // On ICE candidate, eventually set answerSDP
      peerConnection.onicecandidate = (e) => {
        if (!e.candidate && peerConnection?.localDescription) {
          setAnswerSDP(peerConnection.localDescription.sdp || '');
        }
      };
    }

    setStatus('Setting remote offer...');
    const sdpString = remoteOfferRef.current?.value.trim();
    if (!sdpString) return;

    let cleanedSdp = sdpString
    .replace(/^a=max-message-size.*(\r?\n)?/gm, '')
    .replace(/^a=sctp-port.*(\r?\n)?/gm, '');
  
    console.log('CLEANED SDP:\n', cleanedSdp);
    const desc = { type: 'offer' as const, sdp: cleanedSdp };
    await peerConnection.setRemoteDescription(desc);
    setStatus('Remote offer set. Now create answer...');
  }

  async function createAnswer() {
    if (!peerConnection) return;
    setStatus('Creating answer...');
    const answer = await peerConnection.createAnswer();

    let cleanedAnswer = answer.sdp
    .replace(/^a=sctp-port.*(\r?\n)?/gm, '')
    .replace(/^a=max-message-size.*(\r?\n)?/gm, '');
    const newAnswer = { type: 'answer' as RTCSdpType, sdp: cleanedAnswer };

    await peerConnection.setLocalDescription(newAnswer);
  }

  async function setRemoteAnswer() {
    if (!peerConnection) return;
    setStatus('Setting remote answer...');
    const sdpString = remoteAnswerRef.current?.value.trim();
    console.log('BEfore CLEANED SDP:\n', sdpString);
    if (!sdpString) return;


    let cleanedSdp = sdpString
    .replace(/^a=max-message-size.*(\r?\n)?/gm, '')
    .replace(/^a=sctp-port.*(\r?\n)?/gm, '');
  
    console.log('CLEANED SDP:\n', cleanedSdp);
    const desc = { type: 'answer' as const, sdp: cleanedSdp };
    await peerConnection.setRemoteDescription(desc);
    setStatus('Connection established!');
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>WebRTC Connection (Manual Signaling)</h2>
      <div style={{ display: 'inline-block', textAlign: 'left', marginRight: '2rem' }}>
        <h4>1. Create Offer (User A)</h4>
        <button onClick={createOffer}>Create Offer</button>
        <p>Offer SDP:</p>
        <textarea
          value={offerSDP}
          onChange={(e) => setOfferSDP(e.target.value)}
          rows={5}
          style={{ width: '100%', fontFamily: 'monospace' }}
        />

        <h4>2. Paste Remote Answer (from User B)</h4>
        <textarea
          placeholder="Paste Answer here"
          ref={remoteAnswerRef}
          rows={5}
          style={{ width: '100%', fontFamily: 'monospace', marginTop: '0.5rem' }}
        />
        <button onClick={setRemoteAnswer} style={{ marginTop: '0.5rem' }}>
          Set Remote Answer
        </button>
      </div>

      <div style={{ display: 'inline-block', textAlign: 'left' }}>
        <h4>1. Paste Remote Offer (from User A)</h4>
        <textarea
          placeholder="Paste Offer here"
          ref={remoteOfferRef}
          rows={5}
          style={{ width: '100%', fontFamily: 'monospace' }}
        />
        <button onClick={setRemoteOffer} style={{ marginTop: '0.5rem', marginRight: '1rem' }}>
          Set Remote Offer
        </button>
        <button onClick={createAnswer}>Create Answer</button>
        <p>Answer SDP:</p>
        <textarea
          value={answerSDP}
          onChange={(e) => setAnswerSDP(e.target.value)}
          rows={5}
          style={{ width: '100%', fontFamily: 'monospace' }}
        />
      </div>
      <p style={{ marginTop: '1rem' }}>Status: {status}</p>
    </div>
  );
}
