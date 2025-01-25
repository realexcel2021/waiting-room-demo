import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

// Mock authentication function
const mockAuth = (user, password) => {
  if (user === 'test' && password === 'password') {
    return {
      token: 'mock-token',
      expiry: new Date(Date.now() + 600000), // Token valid for 10 minutes
    };
  }
  return null;
};

// Login Component
const LoginPage = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const auth = mockAuth(username, password);
    if (auth) {
      setAuth(auth);
      navigate('/waiting');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className='parent-div'>
      <h1>Login/Register</h1>
      <div className='login-form'>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
