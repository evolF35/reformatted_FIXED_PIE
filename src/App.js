
import React, { useState } from 'react';
import './App.css';
import DeployJS from './pages/DeployPage';
import PoolJS from './pages/PoolPage';


function App() {
  const [activeComponent, setActiveComponent] = useState('DeployJS');

  const handleClick = () => {
    setActiveComponent(activeComponent === 'DeployJS' ? 'OtherComponent' : 'DeployJS');
  };

  let component;
  if (activeComponent === 'DeployJS') {
    component = <DeployJS />;
  } else {
    component = <PoolJS />;
  }

  return (
    <div className="App">
      <button onClick={handleClick}>Switch</button>
      {/* Render the active component */}
      {component}
      {/* Add a button that calls the "handleClick" function when clicked */}
    </div>
  );
}

export default App;
