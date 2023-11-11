const validate = require("validate.js");
const VoterService = require("../services/VoterService");
const Helper = require("../utils/Helper");
const UserConstraints = require("../constraints/UserConstraint");
const AuthenticationService = require("../utils/Authentication");
const Messenger = require("../utils/Messenger");
const { server } = require("../config/main.settings");
const VoteService = require("../services/VoteService");
const CategoryService = require("../services/CategoryService");


let instance;

class UserController {

    #service;
    #helper;
    #constriant;
    #auth;
    #messenger;
    #voteService;
    #categoryService;

    constructor() {
        if (instance) return instance;

        this.#service = new VoterService();
        this.#helper = new Helper();
        this.#constriant = new UserConstraints();
        this.#auth = new AuthenticationService();
        this.#messenger = new Messenger();
        this.#voteService = new VoteService();
        this.#categoryService = new CategoryService();
 
        instance = this;
    }

    userRegistration = async (req, res) => {
        try {
            const validation = await validate(req.body, this.#constriant.userRegistrationConstraint());

            if (validation) {
                res.status(422).json(validation);
                return;
            }

            const pattern = /^[a-zA-Z0-9._%+-]+@lmu\.edu\.ng$/;

            if (!pattern.test(req.body.emailAddress)) {
                res.status(422).json({error: `not a valid email address`});
                return;
            }

            let isUserAvailable = await this.#service.getUserByEmailAddress(req.body.emailAddress);

            if (!isUserAvailable) {
                isUserAvailable = await this.#service.getUserByMatricNo(req.body.matricNo);
            }

            if (isUserAvailable) {
                res.status(400).json({error: `A voter with this email address or matriculation number already exists.`});
                return;
            }

            const user = await this.#service.create(req.body);
            
            if (!user.id) {
                res.status(400).json({error: "internal server error"});
                return;
            }

            const authResponse = await new Promise((resolve, reject) => {
                this.#auth.generateTokens(user.id, resp => resolve(resp))
            })

            await this.#service.update(user.id, { session: authResponse });

            const url = server.domain + "/vote/" + authResponse;

            const emailPayload = {
                to: user.emailAddress,
                subject: "Account Created Successfully",
                html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Voting Application Registration Confirmation</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        }
                
                        h1 {
                            color: #333;
                        }
                
                        p {
                            color: #555;
                        }
                
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #007BFF;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                
                        .validity {
                            margin-top: 20px;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Registration Successful!</h1>
                        <p>Thank you for registering on our voting application. Your account is now active.</p>
                        <a class="button" href="${url}" target="_blank">Click here to vote</a>
                        <p class="validity">This voting link is valid until the voting period expires.</p>
                    </div>
                </body>
                </html>
                `
            }

            this.#messenger.mail(emailPayload);
        
            res.status(200).json({message: `${user.emailAddress}, The voting link has been successfully sent to your mailbox. Please also check your spam/junk folder.`});
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    validationUser = async (req, res) => {
        try {
            const reqDate = new Date();
            const expiresIn = new Date("2023-11-17T00:00:00");

            if (reqDate > expiresIn) {
                res.status(422).json({error: "voting closed"});
                return;
            }

            const validation = await validate(req.params, this.#constriant.userValidationConstraint());

            if (validation) {
                res.status(422).json({error: validation.key});
                return;
            }

            const isTokenValid = await this.#auth.authenticateJWT(req.params.key);

            if (!isTokenValid.isAuth) {
                res.status(401).json({error: "access forbidden"});
                return;
            }

            let user = await this.#service.findById(isTokenValid.userId);

            if (!user) {
                res.status(403).json({error: "access forbidden"});
                return;
            }

            let categories = [];

            const votedCategories = await this.#voteService.getVoterCategories(user.id);

            const categoriesResponse = await this.#categoryService.fetchAll({});

            const allCategories = categoriesResponse.rows;

            const votedCategoryIds = votedCategories.map(votedCategory => votedCategory.CategoryId);

            categories = allCategories.filter(category => !votedCategoryIds.includes(category.id));

            user = {
                userId: user.id,
                categories,
            }

            res.status(200).json(user);
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal sever error"})
        }
    }
}

module.exports = UserController;