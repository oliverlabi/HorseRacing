const cors = require('cors');
const mongoose = require("mongoose");
const express = require('express');
require("dotenv").config();
const PORT = process.env.PORT || 8000

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

mongoose
    .connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
})