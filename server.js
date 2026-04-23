const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function readDB() {
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// GET all
app.get('/api/personas', (req, res) => {
  res.json(readDB());
});

// POST create
app.post('/api/personas', (req, res) => {
  const { dpi, nombre, fecha, estado, sueldo } = req.body;
  if (!dpi || !nombre || !fecha || !estado || !sueldo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }
  const records = readDB();
  const newRecord = { id: Date.now().toString(), dpi, nombre, fecha, estado, sueldo };
  records.push(newRecord);
  writeDB(records);
  res.status(201).json(newRecord);
});

// PUT update
app.put('/api/personas/:id', (req, res) => {
  const records = readDB();
  const idx = records.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Registro no encontrado.' });
  records[idx] = { ...records[idx], ...req.body };
  writeDB(records);
  res.json(records[idx]);
});

// DELETE
app.delete('/api/personas/:id', (req, res) => {
  let records = readDB();
  const exists = records.some(r => r.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Registro no encontrado.' });
  records = records.filter(r => r.id !== req.params.id);
  writeDB(records);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
