const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/api/test01/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Test01 WHERE Id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/api/test01', (req, res) => {
  const page = req.query.page || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const sql = 'SELECT * FROM Test01 LIMIT ? OFFSET ?';
  db.query(sql, [limit, offset], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


app.post('/api/test01', (req, res) => {
  const { Nama, Status } = req.body;
  const sql = 'INSERT INTO Test01 (Nama, Status, Created) VALUES (?, ?, NOW())';
  db.query(sql, [Nama, Status], (err, result) => {
    if (err) throw err;
    res.send('Data berhasil ditambahkan');
  });
});

app.put('/api/test01/:id', (req, res) => {
  const { id } = req.params;
  const { Nama, Status } = req.body;
  const sql =
    'UPDATE Test01 SET Nama = ?, Status = ?, Updated = NOW() WHERE Id = ?';
  db.query(sql, [Nama, Status, id], (err, result) => {
    if (err) throw err;
    res.send('Data berhasil diupdate');
  });
});

// DELETE hapus data
app.delete('/api/test01/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Test01 WHERE Id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send('Data berhasil dihapus');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
