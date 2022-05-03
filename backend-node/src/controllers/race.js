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

exports.createBet = async (req, res) => {
  const { raceID } = req.params
  const { userName, horse, amount } = req.body

  try{
    const userCheck = await User.find({userName: userName})
  
    if(!userCheck) throw Error("Error with username!")

    const race = await Race.findOne({raceID: raceID})

    if(!race) throw Error("Error with finding the race ID!")

    const balanceCheck = await User.findOne({userName: userName}, {_id: 0, balance: 1})

    if(balanceCheck.balance < amount) throw Error("Insufficient balance!")

    const checkBets = await User.find({userName: userName, "bets.raceID": { $in: [ raceID ] } })

    if(JSON.stringify(checkBets) != '[]') throw Error("Bet already exists for that race!");
    
    const deductBalance = await User.findOneAndUpdate({userName: userName}, {balance: balanceCheck.balance - amount})
    
    if(!deductBalance) throw Error("Error deducting balance")

    const addBetDataToUser = await User.findOneAndUpdate({userName: userName}, { $push: { 
      bets: {
        raceID: raceID,
        horse: horse,
        amount: amount,
        active: true
    }}})

    if(!addBetDataToUser) throw Error("Error adding bet data to user!")

    res.status(200).json({ message: "Bet successfully added!" })
  } catch (e){
    res.status(400).json({ error: e.message })
  }
  
}

exports.endBet = async (req, res) => {
  const { raceID } = req.params
  const { userName, horseCount } = req.body

  try{

    const userCheck = await User.find({userName: userName})
  
    if(!userCheck) throw Error("Error with username!")

    const race = await Race.findOne({raceID: raceID})

    if(!race) throw Error("Error with finding the race ID!")

    const userData = await User.findOne({userName: userName, "bets.raceID": raceID}, {_id: 0, "bets.$": 1})
    
    const parsedData = JSON.parse(JSON.stringify(userData.bets[0]))

    if(!userData) throw Error("Error finding the user's horse!")

    const checkWinningHorse = await Race.findOne({raceID: raceID}, {_id: 0, winningHorse: 1})

    if(!checkWinningHorse) throw Error("Error finding the winning horse!")

    const addBetDataToUser = await User.findOneAndUpdate({userName: userName, "bets.raceID": raceID}, { $set: { 
      "bets.$.active": false}})

    if(!addBetDataToUser) throw Error("Error changing active state!")

    const balanceCheck = await User.findOne({userName: userName}, {_id: 0, balance: 1})

    if(checkWinningHorse.winningHorse == parsedData.horse){
      await User.findOneAndUpdate({userName: userName}, {balance: balanceCheck.balance + (parsedData.amount * (horseCount))})
      res.status(200).json(balanceCheck.balance + (parsedData.amount * horseCount))
    } else {
      const balanceData = await User.findOne({userName: userName}, {_id: 0, balance: 1})
      res.status(200).json(balanceData)
    }

  } catch (e){
    res.status(400).json({ error: e.message })
  }
  
}

exports.addWinningHorse = async (req, res) => {
  const { raceID } = req.params
  const { horse } = req.body

  try {
    const race = await Race.findOne({raceID: raceID})

    if(!race) throw Error("Error with finding the race ID!")

    const setWinningHorse = await Race.findOneAndUpdate({raceID: raceID}, {$set: {winningHorse: horse}})

    if(!setWinningHorse) throw Error("Error with setting the winner horse!")

    res.status(200).json({ message: "Winner decided!" })

  } catch (e){
    res.status(400).json({ error: e.message })
  }
}

exports.getUserActiveRaces = async (req, res) => {
  const { userName } = req.params

  try{
    const userCheck = await User.find({userName: userName})
  
    if(!userCheck) throw Error("Error with username!")

    const races = await User.find({userName: userName, "bets.active": true}, {_id: 0, bets: 1})

    res.status(200).json(races)
  } catch (e){
    res.status(400).json({ error: e.message })
  }
}