const Authenticate = require("../utils/Authentication");
const Logger = require("../utils/Logger");
const CategoryService = require("./dataServices/CategoryService");
const VoteService = require("./dataServices/VoteService");
const VoterService = require("./dataServices/VoterService");
const AssociationService = require("./dataServices/AssociationService");
const NomineeService = require("./dataServices/NomineeService")


let instance;
class UserService {

    #notificationService;
    #logger;
    #voteService;
    #voterService;
    #categoryService;
    #authService;
    #nomineeService;
    #associateService;

    constructor() {

        if (instance) return instance;

        this.#logger = new Logger().getLogger();
        this.#voteService = new VoteService();
        this.#voterService = new VoterService();
        this.#categoryService = new CategoryService();
        this.#authService = new Authenticate();
        this.#associateService = new AssociationService();
        this.#nomineeService = new NomineeService()

        instance = this;

    }

    getCategories = async (payload, callback) => {
        try {
            const categories = await this.#categoryService.fetchAll();

            callback({status: 200, categories})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, error: "Internal Server Error"});
        }
    }

    getCategoriesbyAssociation = async (associationId, callback) => {
        try {
            const categories = await this.#categoryService.getCategoriesByAssociation(associationId);

            callback({status: 200, categories})
        } catch (err) {
            console.log(err)
            this.#logger.error(err);
            callback({status: 500, error: "Internal Server Error"});
        }
    }

    getNomineesByCategory = async (query, callback) => {
        try {
            const nominees = await this.#nomineeService.getNomineesByCategory(query);

            callback({status: 200, nominees})
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, error: "Internal Server Error"});
        }
    }

    addNominee = async (payload, callback) => {
        try {
            let isUserValid = await this.#nomineeService.getNomineeByMatriNo(payload);

            if (isUserValid) {
                callback({status: 400, error: "nominee already exist with this matricno"});
                return;
            }
            
            isUserValid = await this.#nomineeService.getNomineeByEmail(payload);
            
            if (isUserValid) {
                callback({status: 400, error: "nominee already exist with this email address"});
                return;
            }

            const nominee = await this.#nomineeService.create(payload);

            if (!nominee.id) {
                callback({status: 400, error: "internal server error"});
                return;
            }

            callback({status: 200, message: "Good Luck on election"});
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, error: "Internal Server Error"});
        }
    }

    addVote = async (payload, callback) => {
        try {

            const isNomineeInCategory = await this.#nomineeService.getNominee({id: payload.NomineeId, categoryId: payload.CategoryId});

            if (!isNomineeInCategory) {
                callback({status: 400,  error: "nominee category must be same with CategoryId passed" });
                return;
            }

            const isVoterValid = await this.#voteService.getVoteByCategoryAndVoter(payload);
            
            if (isVoterValid) {
                callback({status: 400,  error: "you have an existing vote for this category" });
                return;
            }

            const vote = await this.#voteService.create(payload);

            if (!vote.id) {
                callback({status: 400,  error: "Internal Server Error" });
                return;
            }

            callback({status: 200, message: "voted successfully"})
        } catch (ex) {
            this.#logger.error(ex);
            callback({status: 500, error: "internal server error"});
        }
    }

    getVoterVotes = async (voterId, callback) => {
        try {
            const votes = await this.#voteService.getVoterCategories(voterId);

            callback({status: 200, votes});
        } catch (ex) {
            this.#logger.error(ex);
            callback({status: 500, error: "internal server error"});
        }
    }

    getCategoryVotes = async (params, callback) => {
        try {
            const totalVotes = await this.#voteService.getVotesCountByCategory(params.categoryId);

            const serviceResponse = await this.#nomineeService.getNomineesByCategory(params);

            const nominees = serviceResponse.rows;


            let results = [];

            for ( const candidate of nominees ) {
                const nomineeVotes = await this.#voteService.getNomineeVotesCount(candidate.id);

                let percentage = Math.round((nomineeVotes / totalVotes) * 100);

                if (isNaN(percentage)) {
                  percentage = 0;
                }

                let nominee = {
                    firstName: candidate.firstName,
                    lastName: candidate.lastName,
                    matricNo: candidate.matricNo,
                    emailAddress: candidate.emailAddress,
                    pictureUrl: candidate.pictureUrl,
                    category: candidate.Category.category,
                    percentage: `${percentage} %`
                }

                results.push(nominee);
            }

            callback({status: 200,  results, totalVotes});
        } catch (ex) {
            this.#logger.error(ex);
            callback({status: 500, error: "internal server error"});
        }
    }

    getWinners = async (query, callback) => {
        try {
            
            const categories = await this.#categoryService.fetchAll(query);

            let results = [];

            for ( const category of categories.rows ) {
                const totalVotes = await this.#voteService.getVotesCountByCategory(category.id);

                const serviceResponse = await this.#nomineeService.getNomineesByCategory({ categoryId: category.id });

                const nominees = serviceResponse.rows;

                let nomineesResult = [];

                for ( const candidate of nominees ) {
                    const nomineeVotes = await this.#voteService.getNomineeVotesCount(candidate.id);

                    let percentage = Math.round((nomineeVotes / totalVotes) * 100);

                    if (isNaN(percentage)) {
                      percentage = 0;
                    }

                    let nominee = {
                        firstName: candidate.firstName,
                        lastName: candidate.lastName,
                        matricNo: candidate.matricNo,
                        emailAddress: candidate.emailAddress,
                        pictureUrl: candidate.pictureUrl,
                        category: candidate.Category.category,
                    	percentage: `${percentage} %`
                    }

                    nomineesResult.push(nominee);
                }

                const winner = await this.#findHighestPercentage(nomineesResult);

                const categoryResult = {
                    category: category.category,
                    winner: winner[0] || {}
                }

                results.push(categoryResult);
            }

            callback({status: 200, results})
        } catch (ex) {
            this.#logger.error(ex);
            callback({status: 500, error: "internal server error"});
        }
    }
    

    #findHighestPercentage = (arr) => {
        let highestPercentage = 0;
        let highestPercentageArray = [];

        for (let i = 0; i < arr.length; i++) {
          let percentageValue = parseInt(arr[i].percentage);
      
          if (percentageValue > highestPercentage) {
            highestPercentage = percentageValue;
            highestPercentageArray = [arr[i]];
          } else if (percentageValue === highestPercentage) {
            highestPercentageArray.push(arr[i]);
          }
        }
      
        return highestPercentageArray;
    }
}

module.exports = UserService;