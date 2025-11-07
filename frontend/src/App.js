import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Builder from './pages/Builder';
import SavedBuilds from './pages/SavedBuilds';
import Login from './pages/Login';
import Register from './pages/Register';
import HealthCheck from './components/HealthCheck';

function App() {
  return (
    <Router>
      <HealthCheck />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/saved-builds" element={<SavedBuilds />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;