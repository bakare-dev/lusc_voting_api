const VoterEntity = require("../entities/Voter");
const Service = require("./Service");

let instance;

class VoterService extends Service {

    constructor () {
        if (instance) return instance;

        super(VoterEntity)

        instance = this;
    }


    getUserByMatricNo = async (matricno) => {
        return await VoterEntity.findOne({
            where: {
                matricNo: matricno
            }
        })
    }

    getUserByEmailAddress = async (emailAddress) => {
        return await VoterEntity.findOne({
            where: {
                emailAddress: emailAddress
            }
        })
    }
}

module.exports = VoterService;