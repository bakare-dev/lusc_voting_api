const VoteService = require("../services/VoteService");
const VoterService = require("../services/VoterService");
const NomineeService = require("../services/NomineeService");
const CategoryService = require("../services/CategoryService");
const ElectionConstraint = require("../constraints/ElectionConstraint");
const Helper = require("../utils/Helper");
const validate = require("validate.js");
const { server } = require("../config/main.settings");
const Messenger = require("../utils/Messenger");

let instance;

class ElectionController {

    #voteService;
    #voterService;
    #nomineeService;
    #categoryService;
    #helper;
    #constraint;
    #messenger;

    constructor() {
        if (instance) return instance;

        this.#voteService = new VoteService();
        this.#voterService = new VoterService();
        this.#categoryService = new CategoryService();
        this.#nomineeService = new NomineeService();
        this.#helper = new Helper();
        this.#constraint = new ElectionConstraint();
        this.#messenger = new Messenger();
 
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

    addNominee = async (req, res) => {
        try {
            let isUserValid = await this.#nomineeService.getNomineeByMatriNo(req.body);

            if (isUserValid) {
                res.status(400).json({status: 400, error: "nominee already exist with this matricno"});
                return;
            }
            
            isUserValid = await this.#nomineeService.getNomineeByEmail(req.body);
            
            if (isUserValid) {
                res.status(400).json({status: 400, error: "nominee already exist with this email address"});
                return;
            }

            const nominee = await this.#nomineeService.create(req.body);

            if (!nominee.id) {
                res.status(400).json({ status: 400, error: "internal server error"});
                return;
            }

            res.status(200).json({ status: 200, message: "Good Luck on election"});
        } catch (ex) {
            this.#helper.logError(ex);
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

            const isNomineeInCategory = await this.#nomineeService.getNominee({id: req.body.NomineeId, categoryId: req.body.CategoryId});

            if (!isNomineeInCategory) {
                res.status(400).json({ error: "nominee category must be same with CategoryId passed" });
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

                let percentage = (nomineeVotes / totalVotes) * 100;

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

                    let percentage = (nomineeVotes / totalVotes) * 100;

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

            res.status(200).json(results)
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    sendNominationForm = async (req, res) => {
        try {
            let mailPayload = {
                to: req.body.emailAddresses,
                subject: "Action Required: Update Your Nomination Information for the Upcoming Election",
                html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                    }
                
                    .container {
                      max-width: 600px;
                      margin: 20px auto;
                      background-color: #ffffff;
                      padding: 20px;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                
                    h1 {
                      color: #333;
                    }
                
                    p {
                      color: #555;
                    }
                
                    .cta-button {
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: #007bff;
                      color: #fff;
                      text-decoration: none;
                      border-radius: 4px;
                    }
                  </style>
                </head>
                <body>
                
                  <div class="container">
                    <h1>Election Nomination Update</h1>
                    <p>Dear Nominee,</p>
                    <p>We hope this message finds you well. As part of the upcoming election process, we kindly request you to update your data on the voting platform to ensure accurate and secure voting.</p>
                    <p>Please click on the link below to update your information:</p>
                    
                    <a href="https://sa.bakare.tech/nominee/${req.body.CategoryId}" class="cta-button">Update Information</a>
                
                    <p>If you encounter any issues or have questions, please contact our support team.</p>
                
                    <p>Thank you for your participation in the election!</p>
                
                    <p>Best regards,<br>Your Election Committee</p>
                  </div>
                
                </body>
                </html>
                `
            }

            this.#messenger.mail(mailPayload);

            res.status(200).json({message: "done"})
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