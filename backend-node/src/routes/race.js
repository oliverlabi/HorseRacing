const router = require("express").Router()
const raceController = require("../controllers/race")

router.get("/all", raceController.getAllRaces)
router.get("/:raceID", raceController.getCertainRace)
router.post("/create", raceController.createRace)

module.exports = router;