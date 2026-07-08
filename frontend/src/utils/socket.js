import { io } from 'socket.io-client';

const getSocketUrl = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) return 'http://localhost:9000';
  return backendUrl.replace(/\/api\/v1\/?$/, '').trim();
};

export const socket = io(getSocketUrl());