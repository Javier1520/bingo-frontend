import { BehaviorSubject } from 'rxjs';
import { AuthState, GameState } from './types';

export const authState$ = new BehaviorSubject<AuthState>({
  user: localStorage.getItem('user'),
  token: localStorage.getItem('token')
});

export const gameState$ = new BehaviorSubject<GameState>({
  bingoCard: null,
  latestBall: null,
  totalPlayers: 0,
  isRegistered: false,
  gameFinished: false,
  winner: null
});