const mongoose = require("mongoose");
const express = require('express');
const app = require("./backend-node/src/server");
const PORT = process.env.PORT || 8000
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/horse-racing'
var path = require('path');

app.use(express.static(path.join(__dirname, "frontend-react/build")))
if (process.env.NODE_ENV === "production") {
    app.get(/^((?!(api)).)*$/, (req, res) => {
        res.sendFile(path.join(__dirname, '/frontend-react/build/index.html'));
    });
}

mongoose
    .connect(URI, {
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