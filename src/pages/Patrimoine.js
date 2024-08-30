import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const API_URL = 'http://localhost:5000'; // Vérifiez que cela correspond à votre backend

const Patrimoine = () => {
  const [possessions, setPossessions] = useState([]);
  const [total, setTotal] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Valeur Patrimoine',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
      }
    ]
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/possessions`)
      .then(response => {
        const data = response.data;
        setPossessions(data);
        generateGraphData(data);
      })
      .catch(error => console.error('Erreur de récupération des possessions:', error));
  }, []);

  const generateGraphData = (data) => {
    const labels = [];
    const values = [];

    data.forEach((p) => {
      const startDate = new Date(p.dateDebut);
      const endDate = p.dateFin ? new Date(p.dateFin) : new Date();
      const amortRate = p.taux / 100;

      let currentDate = new Date(startDate);
      let currentValue = p.valeur;

      while (currentDate <= endDate) {
        labels.push(currentDate.toISOString().split('T')[0]); // Formatage simplifié pour les labels
        const monthsElapsed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 30));
        const amortizedValue = currentValue * Math.pow(1 - amortRate, monthsElapsed);
        values.push(amortizedValue);

        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Valeur Patrimoine',
          data: values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
        },
      ],
    });
  };

  const calculateTotal = () => {
    const total = possessions.reduce((sum, p) => sum + parseFloat(p.valeur), 0);
    setTotal(total);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Patrimoine</h1>
      <Button variant="primary" onClick={calculateTotal}>
        Calculer le Total
      </Button>
      <div className="total-display mt-3">
        <h4>Total des Patrimoines: {total.toFixed(2)} Ar</h4>
      </div>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Libelle</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Amortissement</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((p) => (
            <tr key={p.libelle}>
              <td>{p.libelle}</td>
              <td>{p.valeur}</td>
              <td>{new Date(p.dateDebut).toLocaleDateString()}</td>
              <td>{p.dateFin ? new Date(p.dateFin).toLocaleDateString() : 'N/A'}</td>
              <td>{p.taux ? `${p.taux}%` : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-4">
        <h3>Graphique de Valeur Patrimoine</h3>
        <div style={{ position: 'relative', height: '400px', width: '100%' }}>
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Patrimoine;
