import axios from 'axios';
import { authState$ } from '../store/Observables';

const API_URL = 'https://johndoe54745.pythonanywhere.com/api';


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

export const getLatestBall = () => api.get('/latest-ball');
