import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';


function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isExpanded={isSidebarExpanded} />
      </header>
    </div>
  );
}

export default App;