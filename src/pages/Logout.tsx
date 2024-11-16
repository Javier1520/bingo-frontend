import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout as logoutAPI } from '../api';

const Logout = () => {
  const { logout: logoutContext } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutAPI();
      } catch (error) {
        console.error('Backend logout failed:', error);

      } finally {
        logoutContext();
        navigate('/login');
      }
    };
    handleLogout();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;