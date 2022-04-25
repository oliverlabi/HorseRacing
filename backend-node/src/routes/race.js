const router = require("express").Router()
const raceController = require("../controllers/race");
const validationMiddleware = require("../middleware/validationMiddleware");
const { check } = require("express-validator");

module.exports = router;