import React, { useState } from 'react';
import axios from 'axios';
import ProductList from './Barista/ProductList';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', { username, password });
      setToken(response.data.token);
      alert('Login successful');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <ProductList/>

    // <div className="App">
    //   <h1>Login</h1>
    //   <input 
    //     type="text" 
    //     placeholder="Username" 
    //     value={username} 
    //     onChange={(e) => setUsername(e.target.value)} 
    //   />
    //   <input 
    //     type="password" 
    //     placeholder="Password" 
    //     value={password} 
    //     onChange={(e) => setPassword(e.target.value)} 
    //   />
    //   <button onClick={handleLogin}>Login</button>

    //   {token && <p>Token: {token}</p>}
    // </div>
  );
}

export default App;
