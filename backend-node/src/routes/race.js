const router = require("express").Router()
const raceController = require("../controllers/race")

router.get("/all", raceController.getAllRaces)
router.get("/getUserActiveRaces/:userName", raceController.getUserActiveRaces)
router.get("/:raceID", raceController.getCertainRace)
router.put("/createBet/:raceID", raceController.createBet)
router.put("/endBet/:raceID", raceController.endBet)
router.put("/addWinningHorse/:raceID", raceController.addWinningHorse)
router.post("/create", raceController.createRace)

module.exports = router;