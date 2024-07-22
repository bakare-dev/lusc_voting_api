const validate = require("validate.js");
const { server } = require("../config/main.settings");
const Logger = require("../utils/Logger");
const ElectionService = require("../services/ElectionService");
const ElectionConstraint = require("../constraints/ElectionConstraint")

let instance;

class ElectionController {

    #logger;
    #constraint;
    #service;

    constructor() {
        if (instance) return instance;

        this.#logger = new Logger().getLogger();
        this.#constraint = new ElectionConstraint();
        this.#service = new ElectionService()
 
        instance = this;
    }
    
    getCategories = async (req, res) => {
        try {
            this.#service.getCategories({}, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    addCategory = async (req, res) => {
        try {
            const validation = await validate(req.body, this.#constraint.addCategory());

            if (validation) {
                res.status(422).json(validation);
                return;
            }

            this.#service.addCategory(req.body, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    addCategories = async (req, res) => {
        try {
            const validation = await validate(req.body, this.#constraint.addCategories());

            if (validation) {
                res.status(422).json(validation);
                return;
            }

            this.#service.addCategories(req.body.categories, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    getCategoriesByAssociation = async (req, res) => {
        try {
            this.#service.getCategoriesbyAssociation(req.query.assocationId, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    getNominees = async (req, res) => {
        try {
            this.#service.getNomineesByCategory(req.params, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    addNominee = async (req, res) => {
        try {
            this.#service.addNominee(req.body, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error", status: 500});
        }
    }

    addVote = async (req, res) => {
        try {
            const validation = await validate(req.body, this.#constraint.addVoteConstraint());

            if (validation) {
                res.status(422).json(validation);
                return;
            }

            this.#service.addVote(req.body, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    getVoterVotes = async (req, res) => {
        try {
            const validation = await validate(req.params, this.#constraint.getVoterVotes());

            if (validation) {
                res.status(422).json(validation);
                return;
            }

            this.#service.getVoterVotes(req.params.voterId, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    getCategoryVotes = async (req, res) => {
        try {
            const validation = await validate(req.params, this.#constraint.getCategoryVotes());

            if (validation) {
                res.status(422).json(validation);
                return;
            }

            this.#service.getCategoryVotes(req.params, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    getWinners = async (req, res) => {
        try {
            
            this.#service.getWinners(req.query, resp => {
                res.status(resp.status).json(resp);
            })
        } catch (ex) {
            this.#logger.error(ex);
            res.status(500).json({error: "internal server error"});
        }
    }
}

module.exports = ElectionController;