const { Schema, model } = require('mongoose')

const bets = new Schema({
    raceID: { type: Number },
    horse: { type: String },
    amount: { type: Number },
    active: { type: Boolean }
})

const userSchema = new Schema({
    userName: { type: String, required: true, unique: true, maxLength: 30 },
    password: { type: String, required: true },
    balance: { type: Number, default: 25 },
    bets: [ bets ],
    createdAt: { type: Date, default: Date.now }
})

const User = model("User", userSchema)

module.exports = User