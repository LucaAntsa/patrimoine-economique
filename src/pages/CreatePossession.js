import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePossession = () => {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [taux, setTaux] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/possessions', {
        libelle,
        valeur,
        dateDebut,
        dateFin,
        taux,
      });

      if (response.status === 201) {
        navigate('/possessions'); // Redirect to the list of possessions
      }
    } catch (error) {
      setError('An error occurred while creating the possession.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Possession</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="libelle">Libelle</label>
          <input
            type="text"
            className="form-control"
            id="libelle"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="valeur">Valeur</label>
          <input
            type="number"
            className="form-control"
            id="valeur"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateDebut">Date Début</label>
          <input
            type="date"
            className="form-control"
            id="dateDebut"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateFin">Date Fin</label>
          <input
            type="date"
            className="form-control"
            id="dateFin"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="taux">Taux d'Amortissement (%)</label>
          <input
            type="number"
            className="form-control"
            id="taux"
            value={taux}
            onChange={(e) => setTaux(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreatePossession;
