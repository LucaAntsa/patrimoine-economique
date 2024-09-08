import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const ListPossession = () => {
  const [possessions, setPossessions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPossessions = async () => {
      try {
        
        const response = await axios.get(`${API_URL}/api/possessions`);
        setPossessions(response.data);
      } catch (error) {
        setError('Une erreur est survenue lors de la récupération des possessions.');
      }
    };

    fetchPossessions();
  }, []);

  const handleClose = async (libelle) => {
    try {
      const encodedLibelle = encodeURIComponent(libelle);
      // Appel API pour supprimer la possession avec l'URL du backend
      await axios.delete(`${API_URL}/api/possessions/${encodedLibelle}`);

      setPossessions((prevPossessions) =>
        prevPossessions.filter((p) => p.libelle !== libelle)
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(`La possession "${libelle}" n'a pas été trouvée.`);
      } else {
        setError('Une erreur est survenue lors de la clôture de la possession.');
      }
    }
  };

  return (
    <div>
      <h1>Liste des Possessions</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link className="btn btn-primary" to="/possession/create">
        Créer une nouvelle possession
      </Link>
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
              <td>{possession.valeur || 'Non défini'}</td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>
                {possession.dateFin
                  ? new Date(possession.dateFin).toLocaleDateString()
                  : 'En cours'}
              </td>
              <td>{possession.taux ? possession.taux + '%' : 'Non défini'}</td>
              <td>
                {possession.valeur && possession.taux
                  ? (possession.valeur * (1 + possession.taux / 100)).toFixed(2)
                  : 'Valeur actuelle indisponible'}
              </td>
              <td>{possession.possesseur ? possession.possesseur.nom : 'Non défini'}</td>
              <td>
                <Link className="btn btn-warning" to={`/possession/${possession.libelle}/update`}>
                  Éditer
                </Link>
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
