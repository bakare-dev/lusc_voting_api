const validate = require("validate.js");
const VoterService = require("../services/VoterService");
const Helper = require("../utils/Helper");
const UserConstraints = require("../constraints/UserConstraint");
const AuthenticationService = require("../utils/Authentication");
const Messenger = require("../utils/Messenger");
const { server } = require("../config/main.settings");
const VoteService = require("../services/VoteService");


let instance;

class UserController {

    #service;
    #helper;
    #constriant;
    #auth;
    #messenger;
    #voteService;

    constructor() {
        if (instance) return instance;

        this.#service = new VoterService();
        this.#helper = new Helper();
        this.#constriant = new UserConstraints();
        this.#auth = new AuthenticationService();
        this.#messenger = new Messenger();
        this.#voteService = new VoteService();
 
        instance = this;
    }

    userRegistration = async (req, res) => {
        try {
            const validation = await validate(req.body, this.#constriant.userRegistrationConstraint());

            if (validation) {
                res.status(422).json(validation);
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

            const url = server.domain + "/user/validate" + authResponse;

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
                        <p class="validity">This link is valid for 3 days from the date of registration.</p>
                    </div>
                </body>
                </html>
                `
            }

            this.#messenger.mail(emailPayload);
        
            res.status(200).json({message: `check your email(${user.emailAddress}) for voting link`});
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal server error"});
        }
    }

    validationUser = async (req, res) => {
        try {
            const validation = await validate(req.params, this.#constriant.userValidationConstraint());

            if (validation) {
                res.status(422).json({error: validation.key});
                return;
            }

            const isTokenValid = await this.#auth.authenticateJWT(req.params.key);

            if (!isTokenValid.isAuth) {
                res.status(401).json({error: "expired token"});
                return;
            }

            let user = await this.#service.findById(isTokenValid.userId);

            if (!user.id) {
                res.status(403).json({error: "access forbidden"});
                return;
            }

            const categories = await this.#voteService.getVoterCategories(user.id);

            user.categories = categories;

            res.status(200).json(user);
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal sever error"})
        }
    }
}

module.exports = UserController;