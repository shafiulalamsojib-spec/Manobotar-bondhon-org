
/**
 * BACKEND SERVER LOGIC (Node.js/Express)
 * This file is for implementation reference.
 * Required Dependencies: express, pg, bcrypt, jsonwebtoken, cors, multer
 */

/*
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// DB Connection (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware: Authenticate
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, approved) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hashedPassword, 'Member', false]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'User already exists or DB error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ id: user.id, name: user.name, role: user.role, approved: user.approved, token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// --- DONATION ROUTES ---

app.post('/api/donations', authenticateToken, async (req, res) => {
  const { amount, method, trx_id } = req.body;
  await pool.query(
    'INSERT INTO donations (user_id, amount, method, trx_id, status) VALUES ($1, $2, $3, $4, $5)',
    [req.user.id, amount, method, trx_id, 'Pending']
  );
  res.status(201).send('Donation submitted');
});

// --- ADMIN ROUTES ---

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Admin') return res.sendStatus(403);
  const result = await pool.query('SELECT id, name, email, role, approved FROM users');
  res.json(result.rows);
});

app.put('/api/admin/users/:id/approve', authenticateToken, async (req, res) => {
  if (req.user.role !== 'Admin') return res.sendStatus(403);
  await pool.query('UPDATE users SET approved = true WHERE id = $1', [req.params.id]);
  res.send('User approved');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/
