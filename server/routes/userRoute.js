const router = require("express").Router();
const UserController = require("../../controllers/UserController");
const AuthenticationService = require("../../utils/Authentication");
const controller = new UserController();
const auth = new AuthenticationService();

router.post("/", controller.userRegistration);
router.get("/validate/:key", controller.validationUser)

module.exports = router;