const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.login = async (req, res) => {
    const { password, userName } = req.body

    try {
        const user = await User.findOne({userName: userName})
        if (!user) throw Error("User with this username does not exist")

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw Error("Invalid credentials!")

        const userTemplate = {
        id: user.id,
        userName
        }

        const token = jwt.sign(userTemplate, process.env.JWT_SECRET)
        if (!token) throw Error("Something critical happened")

        res.status(200).json({
        token,
        ...userTemplate
        })

    } catch (e){
        res.status(400).json({ error: e.message })
    }
}

exports.signup = async (req, res) => {
    const { userName, password } = req.body

    try {
        const userCheck = await User.findOne({ userName: userName })

        if (userCheck) throw Error("User with that username already exists")

        const salt = await bcrypt.genSalt(10)
        if (!salt) throw Error("Something critical happened! Code:4833875")

        const hash = await bcrypt.hash(password, salt)
        if (!hash) throw Error("Something critical happened! Code:123237")

        const newUser = new User({
            userName,
            password: hash,
            passwordConfirmation: hash,
        })

        const savedUser = await newUser.save()
        if (!savedUser) throw Error("Error saving user")

        res.status(200).json({ message: "User created successfully" })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
}

exports.getUser = async (req, res) => {
    const { userName } = req.params
    try{
        const data = await User.findOne({userName: userName})

        if (!data) throw Error("Error finding user")

        res.status(200).json(data)
    } catch (e){
        res.status(400).json({ error: e.message })
    }
}

exports.modifyBalance = async (req, res) => {
    const { amount, operator } = req.body
    const { userName } = req.params
    
    try{
        const data = await User.findOne({userName: userName})

        if (!data) throw Error("Error finding user")
        switch (operator) {
            case "1":
                const addWinningBalanceToUser = await User.findOneAndUpdate({userName: userName}, { $inc: { balance: amount}})
                if(!addWinningBalanceToUser) throw Error("Error adding winning balance to user!")
                break;
            case "2":
                const removeBalanceFromUser = await User.findOneAndUpdate({userName: userName}, { $inc: { balance: -amount}})
                if(!removeBalanceFromUser) throw Error("Error removing balance from user!")
                break;
            default:
                const addTopUpBalanceToUser = await User.findOneAndUpdate({userName: userName}, { $inc: { balance: 1}})
                if(!addTopUpBalanceToUser) throw Error("Error topping up user's balance!")
        }

        res.status(200).json({ message: "Changing balance was successful!" })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
}