import { authState$ } from '../store/Observables';
import { api } from './api';

class AuthService {
  async login(username: string, password: string) {
    try {
      const response = await api.post('/auth/token/login/', { username, password });
      const token = response.data.auth_token;

      localStorage.setItem('token', token);
      localStorage.setItem('user', username);

      authState$.next({ user: username, token });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await api.post('/auth/token/logout/');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      authState$.next({ user: null, token: null });
    }
  }
}

export const authService = new AuthService();