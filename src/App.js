import React from 'react';
import './App.css';
import Login from './components/login/login';
import Data from './services/data';
import Home from './components/home';
function App() {
  const checkCookie = () => {
    console.log(' in getcookie');
    let loginStatus = Data.getLoginStatus();
    console.log(' xxxxxxx ---- loginStatus :', loginStatus);
    return loginStatus ? loginStatus : null;
  }
  return (
    <div className="wrapper" >
      {
        // checkCookie() ? <Home/> : <Login/>
        Data.getLoginStatus() !== null ? <Home/> : <Login/>
      }
    </div>
  );
}

export default App;
