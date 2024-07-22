const router = require("express").Router();
const Controller = require("../../controllers/ElectionController.js");
const controller = new Controller();

router.get("/categories", controller.getCategories);
router.post("/categories", controller.addCategories);
router.post("/category", controller.addCategory);
router.get("/association/categories", controller.getCategoriesByAssociation);
router.get("/category/nominees/:categoryId", controller.getNominees);
router.post("/vote", controller.addVote);
router.post("/nominee", controller.addNominee)
router.get("/voter/vote/:voterId", controller.getVoterVotes);
router.get("/vote/category/:categoryId", controller.getCategoryVotes);
router.get("/result", controller.getWinners);

module.exports = router;