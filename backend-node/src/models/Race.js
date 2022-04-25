const { Schema, model } = require('mongoose')
var mongoose = require('mongoose');

const raceSchema = new Schema({
    raceID: { type: Number, required: true, unique: true,  default: Date.now},
    raceName: { type: String, required: true, maxLength: 50 },
    raceDescription: { type: String, required: true, maxLength: 300 },
    startingTime: { type: Date, required: true },
    participatingHorses: [{}],
    createdBy: { type: mongoose.Schema.Types.String, required: true, ref: "User"},
    createdAt: { type: Date, default: Date.now }
});

const Race = model("race", raceSchema)

module.exports = Race