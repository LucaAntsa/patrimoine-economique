import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListPossession = () => {
  const [possessions, setPossessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPossessions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/possessions');
        setPossessions(response.data);
      } catch (error) {
        setError('Une erreur est survenue lors de la récupération des possessions.');
      }
    };

    fetchPossessions();
  }, []);

  const handleClose = async (libelle) => {
    try {
      await axios.put(`http://localhost:5000/api/possessions/${libelle}/close`);
      setPossessions(prevPossessions => prevPossessions.filter(p => p.libelle !== libelle));
    } catch (error) {
      setError('Une erreur est survenue lors de la clôture de la possession.');
    }
  };

  return (
    <div>
      <h1>Liste des Possessions</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link className="btn btn-primary" to="/possession/create">Créer une nouvelle possession</Link>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Libelle</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Taux</th>
            <th>Valeur Actuelle</th>
            <th>Possesseur</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession) => (
            <tr key={possession.libelle}>
              <td>{possession.libelle}</td>
              <td>{possession.valeur}</td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'En cours'}</td>
              <td>{possession.tauxAmortissement}%</td>
              <td>{(possession.valeur * (1 + possession.tauxAmortissement / 100)).toFixed(2)}</td>
              <td>{possession.possesseur ? possession.possesseur.nom : 'Non défini'}</td>
              <td>
                <Link className="btn btn-warning" to={`/possession/${possession.libelle}/update`}>Éditer</Link>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleClose(possession.libelle)}
                  disabled={possession.dateFin} 
                >
                  Clôturer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPossession;
