import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();

// Configurer CORS pour autoriser plusieurs origines
const allowedOrigins = ['http://localhost:3000', 'http://192.168.221.1:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  }
}));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Configurer __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir le dossier "data" statiquement
app.use('/data', express.static(path.join(__dirname, 'data')));

// Fonction pour lire les données du fichier JSON
const readDataFile = () => {
  const filePath = path.join(__dirname, 'data', 'data.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Charger les données depuis le fichier JSON
let data = readDataFile();

// Endpoint: Get Possession list
app.get('/api/possessions', (req, res) => {
  const patrimoine = data.find(item => item.model === 'Patrimoine');
  if (patrimoine) {
    res.json(patrimoine.data.possessions);
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Endpoint: Get Possession details
app.get('/api/possessions/:libelle', (req, res) => {
  const { libelle } = req.params;
  const patrimoine = data.find(item => item.model === 'Patrimoine');
  if (patrimoine) {
    const possession = patrimoine.data.possessions.find(p => p.libelle === libelle);
    if (possession) {
      res.json(possession);
    } else {
      res.status(404).json({ message: 'Possession not found' });
    }
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Endpoint: Create a new Possession
app.post('/api/possessions', (req, res) => {
  const newPossession = req.body;
  const patrimoine = data.find(item => item.model === 'Patrimoine');
  if (patrimoine) {
    patrimoine.data.possessions.push(newPossession);
    fs.writeFileSync(path.join(__dirname, 'data', 'data.json'), JSON.stringify(data, null, 2));
    res.status(201).json(newPossession);
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Endpoint: Update an existing Possession
app.put('/api/possessions/:libelle', (req, res) => {
  const { libelle } = req.params;
  const updatedPossession = req.body;
  const patrimoine = data.find(item => item.model === 'Patrimoine');
  if (patrimoine) {
    const index = patrimoine.data.possessions.findIndex(p => p.libelle === libelle);
    if (index !== -1) {
      patrimoine.data.possessions[index] = updatedPossession;
      fs.writeFileSync(path.join(__dirname, 'data', 'data.json'), JSON.stringify(data, null, 2));
      res.json(updatedPossession);
    } else {
      res.status(404).json({ message: 'Possession not found' });
    }
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Endpoint: Delete a Possession
app.delete('/api/possessions/:libelle', (req, res) => {
  const { libelle } = req.params;
  const patrimoine = data.find(item => item.model === 'Patrimoine');
  if (patrimoine) {
    const index = patrimoine.data.possessions.findIndex(p => p.libelle === libelle);
    if (index !== -1) {
      patrimoine.data.possessions.splice(index, 1);
      fs.writeFileSync(path.join(__dirname, 'data', 'data.json'), JSON.stringify(data, null, 2));
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Possession not found' });
    }
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
