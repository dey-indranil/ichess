// Example placeholder for a Socket.IO or WebSocket client.
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export function initSocket() {
  socket = io('http://localhost:4000'); // Example backend endpoint
  return socket;
}

export function getSocket() {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
}
