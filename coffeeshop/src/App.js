import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WarehouseProduct from './page/warehouse/warehouseProduct';
import WarehouseCategory from './page/warehouse/warehouseCategory';

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
