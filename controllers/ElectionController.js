const VoteService = require("../services/VoteService");
const VoterService = require("../services/VoterService");
const NomineeService = require("../services/NomineeService");
const CategoryService = require("../services/CategoryService");
const ElectionConstraint = require("../constraints/ElectionConstraint");
const Helper = require("../utils/Helper");
const validate = require("validate.js");

let instance;

class ElectionController {

    #voteService;
    #voterService;
    #nomineeService;
    #categoryService;
    #helper;
    #constraint;

    constructor() {
        if (instance) return instance;

        this.#voteService = new VoteService();
        this.#voterService = new VoterService();
        this.#categoryService = new CategoryService();
        this.#nomineeService = new NomineeService();
        this.#helper = new Helper();
        this.#constraint = new ElectionConstraint();
 
        instance = this;
    }
    
    getCategories = async (req, res) => {
        try {
            const categories = await this.#categoryService.fetchAll(req.query);

            res.status(200).json(categories);
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    getNominees = async (req, res) => {
        try {
            const nominees = await this.#nomineeService.getNomineesByCategory(req.params);

            res.status(200).json(nominees);
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    addVote = async (req, res) => {
        try {
            const validation = await validate(req.body, this.#constraint.addVoteConstraint());

            if (validation) {
                res.status(422).json(validation);
                return;
            }

            const isVoterValid = await this.#voteService.getVoteByCategoryAndVoter(req.body);
            
            if (isVoterValid) {
                res.status(400).json({ error: "you have an existing vote for this category" });
                return;
            }

            const vote = await this.#voteService.create(req.body);

            if (!vote.id) {
                res.status(400).json({ error: "internal server error" });
                return;
            }

            res.status(200).json({message: "voted successfully"})
        } catch (ex) {
            this.#helper.logError(ex);
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

            const votes = await this.#voteService.getVoterCategories(req.params.voterId);

            res.status(200).json(votes);
        } catch (ex) {
            this.#helper.logError(ex);
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

            const totalVotes = await this.#voteService.getVotesCountByCategory(req.params.categoryId);

            const serviceResponse = await this.#nomineeService.getNomineesByCategory(req.params);

            const nominees = serviceResponse.rows;


            let results = [];

            for ( const candidate of nominees ) {
                const nomineeVotes = await this.#voteService.getNomineeVotesCount(candidate.id);

                const percentage = (nomineeVotes / totalVotes) * 100;

                let nominee = {
                    firstName: candidate.firstName,
                    lastName: candidate.lastName,
                    matricNo: candidate.matricNo,
                    emailAddress: candidate.emailAddress,
                    pictureUrl: candidate.pictureUrl,
                    category: candidate.Category.category,
                    percentage: percentage + " %"
                }

                results.push(nominee);
            }

            res.status(200).json({ results, totalVotes});
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    getWinners = async (req, res) => {
        try {
            const categories = await this.#categoryService.fetchAll(req.query);

            let results = [];

            for ( const category of categories.rows ) {
                const totalVotes = await this.#voteService.getVotesCountByCategory(category.id);

                const serviceResponse = await this.#nomineeService.getNomineesByCategory({ categoryId: category.id });

                const nominees = serviceResponse.rows;

                let nomineesResult = [];

                for ( const candidate of nominees ) {
                    const nomineeVotes = await this.#voteService.getNomineeVotesCount(candidate.id);

                    const percentage = (nomineeVotes / totalVotes) * 100;

                    let nominee = {
                        firstName: candidate.firstName,
                        lastName: candidate.lastName,
                        matricNo: candidate.matricNo,
                        emailAddress: candidate.emailAddress,
                        pictureUrl: candidate.pictureUrl,
                        category: candidate.Category.category,
                        percentage: percentage + " %"
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

            res.status(200).json(results)
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal server error"});
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

module.exports = ElectionController;