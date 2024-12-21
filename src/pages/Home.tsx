import { useNavigate } from 'react-router-dom';
import { gameService } from '../services/GameService';
import LogoutButton  from '../components/LogoutButton';

const Home = () => {
  const navigate = useNavigate();

  const handleRegisterToGame = async () => {
    try {
      await gameService.registerToGame();
      alert('Registered to game successfully!');
      navigate('/room')
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  return (
    <>
    <LogoutButton/>

    <div>
      <h1>Welcome {localStorage.getItem('user')}</h1>
      <button onClick={handleRegisterToGame}>Register for Game</button>
    </div>
    </>
  );
};

export default Home;
