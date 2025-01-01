import axios from 'axios';
import { authState$, gameState$ } from '../store/Observables';

const API_URL = 'https://bingo-backend-6epn.onrender.com/api';


export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use(config => {
  const token = authState$.value?.token;
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Authentication-related methods
export const login = (username: string, password: string) =>
  api.post('/auth/token/login/', { username, password });

export const register = (username: string, password: string) =>
  api.post('/auth/users/', { username, password });

export const logout = () => api.post('/auth/token/logout/');

// Game-related methods
export const registerToGame = () => api.post('/register-to-game');

export const getBingoCard = () => api.get('/bingo-card');

export const claimWin = () => api.post('/claim-win');

// WebSocket connection method
export const connectToGame = () => {
  const token = authState$.value?.token;
  if (!token) {
    console.error('No token available, cannot connect to WebSocket');
    return;
  }

  // Use a fixed URL since there is only one game session
  const socket = new WebSocket(`wss://bingo-backend-6epn.onrender.com/ws/game/?token=${token}`);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'game.ball') {
      console.log(`New ball drawn: ${data.message.ball}`);
      gameState$.next({
        ...gameState$.value,
        latestBall: data.message.ball
      });
    } else if (data.type === 'game.finish') {
      console.log('Game finished');
      gameState$.next({
        bingoCard: null,
        latestBall: null,
        isRegistered: false,
        gameFinished: true,
      });
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  return socket;
};
