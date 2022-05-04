const mongoose = require("mongoose");
const express = require('express');
const app = require("./server");
const PORT = process.env.PORT || 8000
require("dotenv").config();

mongoose
    .connect('mongodb://localhost:27017/horse-racing', {
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