const Race = require('../models/Race')
const User = require('../models/User')
var mongoose = require('mongoose');

exports.getAllRaces = async (req, res) => {
    const races = await Race.find({})
    res.status(200).send(races)
}

exports.getCertainRace = async (req, res) => {
    const { raceID } = req.params;
    try{
        const race = await Race.findOne({raceID: raceID})

        if (!race) throw Error("Error finding race")

        res.status(200).json(race)
    } catch (e){
        res.status(400).json({ error: e.message })
    }
}

exports.createRace = async (req, res) => {
    const newRace = new Race ({
      "raceName": req.body.raceName,
      "raceDescription": req.body.raceDescription,
      "raceTrack": req.body.raceTrack,
      "startingTime": req.body.startingTime,
      "participatingHorses": req.body.participatingHorses,
      "horseColors": req.body.horseColors,
      "createdBy": req.body.userName
    })
    newRace.save()
      .then(() =>{
        res.status(200).send("Race has been uploaded")
      }).catch(err => res.status(500).json(err))
  }