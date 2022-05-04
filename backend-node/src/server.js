const cors = require('cors');
const express = require('express');

const authRoutes = require('./routes/auth');
const raceRoutes = require('./routes/race');

const app = express()
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Up and running")
})

app.use('/api/auth', authRoutes);
app.use('/api/race', raceRoutes);

module.exports = app;