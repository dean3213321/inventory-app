import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Users from './components/Users';
import Sales from './components/Sales';
import Borrowers from './components/Borrowers';
import Products from './components/Products';



function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
  <Router> 
    <div className="App">
      <header className="App-header">
        <Navbar toggleSidebar={toggleSidebar} />
      </header>
        <Sidebar isExpanded={isSidebarExpanded} />
        <div className={`main-content ${isSidebarExpanded ? 'expanded' : ''}`}>
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/Users" element={<Users />} />
            <Route exact path="/Products" element={<Products />} />
            <Route exact path="/Sales" element={<Sales />} />
            <Route exact path="/Borrowers" element={<Borrowers />} />
          </Routes>
        </div>
    </div>
    </Router> 
  );
}

export default App;