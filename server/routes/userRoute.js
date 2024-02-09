const router = require("express").Router();
const UserController = require("../../controllers/UserController");
const controller = new UserController();

router.post("/", controller.userRegistration);
router.get("/validate/:key", controller.validationUser)

module.exports = router;