const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    userName: { type: String, required: true, unique: true, maxLength: 50 },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = model("User", userSchema)

module.exports = User