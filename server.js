require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// GET all
app.get('/api/personas', async (req, res) => {
  const { data, error } = await supabase.from('personas').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST create
app.post('/api/personas', async (req, res) => {
  const { dpi, nombre, fecha, estado, sueldo } = req.body;
  if (!dpi || !nombre || !fecha || !estado || !sueldo)
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });

  const { data, error } = await supabase.from('personas').insert([{ dpi, nombre, fecha, estado, sueldo }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT update
app.put('/api/personas/:dpi', async (req, res) => {
  const { nombre, fecha, estado, sueldo } = req.body;
  const { data, error } = await supabase.from('personas').update({ nombre, fecha, estado, sueldo }).eq('dpi', req.params.dpi).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE
app.delete('/api/personas/:dpi', async (req, res) => {
  const { error } = await supabase.from('personas').delete().eq('dpi', req.params.dpi);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
