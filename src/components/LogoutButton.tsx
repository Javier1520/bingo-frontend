import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login');
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
