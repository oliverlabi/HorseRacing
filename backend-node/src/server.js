const cors = require('cors');
const mongoose = require("mongoose");
const express = require('express');
const PORT = process.env.PORT || 8000

require("dotenv").config();

const app = express()
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Up and running")
})

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