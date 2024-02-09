const validate = require("validate.js");
const UserConstraints = require("../constraints/UserConstraint");
const UserService = require("../services/UserService");
const Logger = require("../utils/Logger");


let instance;

class UserController {

    #service;
    #logger;
    #constriant;

    constructor() {
        if (instance) return instance;

        this.#service = new UserService();
        this.#logger = new Logger().getLogger();
        this.#constriant = new UserConstraints();
 
        instance = this;
    }

    userRegistration = async (req, res) => {
        try {
            const validation = await validate(req.body, this.#constriant.userRegistrationConstraint());

            if (validation) {
                res.status(422).json(validation);
                return;
            }

			this.#service.votersRegistration(req.body, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    validationUser = async (req, res) => {
        try {
            const validation = await validate(req.params, this.#constriant.userValidationConstraint());

            if (validation) {
                res.status(422).json({ error: validation.key });
                return;
            }

            this.#service.votersValidation(req.params.key, resp => {
                res.status(resp.status).json(resp)
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal sever error"})
        }
    }
}

module.exports = UserController;