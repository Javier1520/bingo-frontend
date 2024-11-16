
import { useNavigate } from 'react-router-dom';
import { registerToGame } from '../services/api';

const Home = () => {
  const navigate = useNavigate();

  const handleRegisterToGame = async () => {
    try {
      await registerToGame();
      alert('Registered to game successfully!');
      navigate('/room')
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  return (
    <div>
      <h1>Welcome {localStorage.getItem('user')}</h1>
      <button onClick={handleRegisterToGame}>Register for Game</button>
    </div>
  );
};

export default Home;
