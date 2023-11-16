const router = require("express").Router();
const Controller = require("../../controllers/ElectionController.js");
const controller = new Controller();

router.get("/categories", controller.getCategories);
router.get("/category/nominees/:categoryId", controller.getNominees);
router.post("/vote", controller.addVote);
router.post("/nominee", controller.addNominee)
router.get("/voter/vote/:voterId", controller.getVoterVotes);
router.get("/vote/category/:categoryId", controller.getCategoryVotes);
router.get("/result", controller.getWinners);
router.post("/form/nominees", controller.sendNominationForm);
router.post("/seat/register", controller.registerSeat);
router.get("/seat/count", controller.getSeatCount);
router.get("/seat/validate/:matricNo", controller.validateSeat)
router.get("/votersall", controller.getVoters)

module.exports = router;