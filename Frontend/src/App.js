import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Homepage from './components/homepage';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Ram from './components/Ram';
import ListaPro from './components/ListaPro';
import Logs from './components/Logs';


function App() {
  return (
    <Router>
    <div className="app-container">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/Ram" element={<Ram/>} />
        <Route path="/Lista" element={<ListaPro/>} />
        <Route path="/Logs" element={<Logs/>} />
      </Routes>
     
    </div>
  </Router>
  );
}

export default App;
