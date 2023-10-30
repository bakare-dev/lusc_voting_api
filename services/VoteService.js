const CategoryEntity = require("../entities/Category");
const NomineeEntity = require("../entities/Nominee");
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

    getVotesByCategory = async (categoryId) => {
        return await VoteEntity.findAll({
            where: {
                CategoryId: categoryId
            }
        })
    }

    getVoterCategories = async (voterId) => {
        return await VoteEntity.findAll({
            where: {
                VoterId: voterId
            },
            include: [ CategoryEntity, NomineeEntity ]
        })
    }

    getVoteByCategoryAndVoter = async (query) => {
        return await VoteEntity.findOne({
            where: {
                CategoryId: query.CategoryId,
                VoterId: query.VoterId
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