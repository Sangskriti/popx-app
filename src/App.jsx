import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Accounts from './components/Accounts';

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/account-settings" element={<Accounts />} />
        </Routes>
      </div>
  );
}

export default App;