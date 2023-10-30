const VoterEntity = require("../entities/Voter");
const Service = require("./Service");

let instance;

class VoterService extends Service {

    constructor () {
        if (instance) return instance;

        super(VoterEntity)

        instance = this;
    }

}

module.exports = VoterService;