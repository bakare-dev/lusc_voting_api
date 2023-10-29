const VoteEntity = require("../entities/Vote");
const Service = require("./Service");

let instance;

class VoteService extends Service {

    constructor () {
        if (instance) return instance;

        super(VoteEntity)

        instance = this;
    }

    getNomineeVotesCountByCategory = async (payload) => {
        return await VoteEntity.count({
            where: {
                NomineeId: payload.nomineeId,
                CategoryId: payload.categoryId
            }
        })
    }

    getVotesCountByCategory = async (categoryId) => {
        return await VoteEntity.count({
            where: {
                CategoryId: categoryId
            }
        })
    }

    getNomineeVotesCount = async (nomineeId) => {
        return await VoteEntity.count({
            where: {
                NomineeId: nomineeId,
            }
        })
    }

    getVoterVotesCount = async (voterId) => {
        return await VoteEntity.count({
            where: {
                VoterId: voterId,
            }
        })
    }
}

module.exports = VoteService;