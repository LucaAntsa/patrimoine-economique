import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import CreatePossession from './pages/CreatePossession';
import ListPossession from './pages/ListPossession';
import UpdatePossession from './pages/UpdatePossession';
import Patrimoine from './pages/Patrimoine';
import PossessionsTable from './models/Possession'; 
import Home from './pages/home'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patrimoine" element={<Patrimoine />} />
          <Route path="/possession" element={<ListPossession />} />
          <Route path="/possession/create" element={<CreatePossession />} />
          <Route path="/possession/:libelle/update" element={<UpdatePossession />} />
          <Route path="/patrimoine/possessions-table" element={<PossessionsTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
