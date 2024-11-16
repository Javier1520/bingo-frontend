import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const getToken = () => localStorage.getItem('token');

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const login = (username: string, password: string) =>
  apiClient.post('/auth/token/login/', { username, password });

export const register = (username: string, password: string) =>
  apiClient.post('/auth/users/', { username, password });

export const registerToGame = () =>
  apiClient.post('/register-to-game', {}, { headers: { Authorization: `Token ${getToken()}` } });

export const getBingoCard = () =>
  apiClient.get('/bingo-card', { headers: { Authorization: `Token ${getToken()}` } });

export const claimWin = () =>
  apiClient.post('/claim-win', {}, { headers: { Authorization: `Token ${getToken()}` } });

export const getLatestBall = () =>
  apiClient.get('/latest-ball', { headers: { Authorization: `Token ${getToken()}` } });
