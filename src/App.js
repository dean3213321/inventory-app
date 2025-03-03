import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Navbar />
      <Sidebar />
      </header>
    </div>
  );
}

export default App;
