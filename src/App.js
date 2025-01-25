import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login';
import WaitingRoom from './components/WaitingRoom';
import WelcomePage from './components/WelcomePage';
import './App.css'



// App Component
const App = () => {
  const [auth, setAuth] = useState(null);
  const [vwrToken, setVwarToken] = useState(null)
  const [vwrTokenExpiresIn, setVwarTokenExpiresIn] = useState(null)


  return (
    <Router>
      <Routes>
        <Route path="/" element={
          auth ? (
            <WaitingRoom auth={auth} setVwarToken={setVwarToken} setVwarTokenExpiresIn={setVwarTokenExpiresIn}/>
          ) : (
            <LoginPage setAuth={setAuth}/>
          )
        } />
        <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
        <Route
          path="/waiting"
          element={
            auth ? (
              <WaitingRoom auth={auth} setVwarToken={setVwarToken} setVwarTokenExpiresIn={setVwarTokenExpiresIn}/>
            ) : (
              <p>Please log in first.</p>
            )
          }
        />
        <Route
          path="/welcome"
          element={auth ? <WelcomePage auth={auth} vwrToken={vwrToken} tokenExpiryInSeconds={vwrTokenExpiresIn}/> : <p>Please log in first.</p>}
        />
      </Routes>
    </Router>
  );
};

export default App;
