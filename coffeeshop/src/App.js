import React, { useState } from 'react';
import axios from 'axios';
import UserList from './page/shopowner/userlist'

function App() {

  return (
    <div className="App">
      <h1>Login</h1>
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

      {token && <p>Token: {token}</p>}
    </div>
  );
}

export default App;
