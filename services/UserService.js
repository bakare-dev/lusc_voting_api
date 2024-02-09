const Authenticate = require("../utils/Authentication");
const Logger = require("../utils/Logger");
const NotificationService = require("./NotificationService");
const CategoryService = require("./dataServices/CategoryService");
const VoteService = require("./dataServices/VoteService");
const VoterService = require("./dataServices/VoterService");


let instance;
class UserService {

    #notificationService;
    #logger;
    #voteService;
    #voterService;
    #categoryService;
    #authService;

    constructor() {

        if (instance) return instance;

        this.#notificationService = new NotificationService();
        this.#logger = new Logger().getLogger();
        this.#voteService = new VoteService();
        this.#voterService = new VoterService();
        this.#categoryService = new CategoryService();
        this.#authService = new Authenticate();

        instance = this;

    }

    votersRegistration = async (payload, callback) => {
        try {
            const regno = payload.matricNo;
            const isMatricValid = /^(21|22|23)/.test(regno);
            const isCDRequired = /^(21|22)/.test(regno);

            if (!isMatricValid) {
                callback({ status: 400, error: "Only Students from 100-300 Levels are allowed to vote." });
                return;
            }

            if (isCDRequired && !regno.includes("CD")) {
                callback({ status: 400, error: "Please use your matric number to register and ensure the alphabet is in uppercase (CD)." });
                return;
            }

            const emailPattern = /^[a-zA-Z0-9._%+-]+@lmu\.edu\.ng$/;

            if (!emailPattern.test(payload.emailAddress)) {
                callback({ status: 422, error: "Please use a valid LMU email address." });
                return;
            }   
            
            let isUserAvailable = await this.#voterService.getUserByEmailAddress(payload.emailAddress);

            if (!isUserAvailable) {
                isUserAvailable = await this.#voterService.getUserByMatricNo(payload.matricNo);
            }

            if (isUserAvailable) {
                callback({ status: 400, error: "A voter with this email address or matriculation number already exists." });
                return;
            }

            const user = await this.#voterService.create(payload);

            if (!user.id) {
                if (user.name === 'SequelizeUniqueConstraintError') {
                    callback({ status: 400, error: "A voter with this email address or matriculation number already exists." });
                    return;
                }
                callback({ status: 500, error: "Internal server error." });
                return;
            }

            const authResponse = await new Promise((resolve, reject) => {
                this.#authService.generateTokens(user.id, resp => resolve(resp))
            });

            await this.#voterService.update(user.id, { session: authResponse });

            const url = server.domain + "/vote/" + authResponse;
            let userNotification = {
                recipients: [`${user.emailAddress}`],
                data: {
                    url,
                },
            };

            this.#notificationService.sendVerifyRegistration(userNotification, (resp) => {
                if (resp.status == "success") {
                    callback({ 
                        status: 200,
                        message: `${user.emailAddress}, the voting link has been successfully sent to your mailbox. Please also check your spam/junk folder.`
                    });
                    return;
                } else {
                    this.#voteService.delete(user.id);
                    callback({
                        status: 500,
                        error: "Something went wrong. Please contact the administrator.",
                    });
                    return;
                }
            });
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, error: "Internal Server Error"});
        }
    }
    
    votersValidation = async (token, callback) => {
        try {
            const reqDate = new Date();
            const expiresIn = new Date("2023-11-17T00:00:00");

            if (reqDate > expiresIn) {
                callback({ status: 422, error: "Voting Closed" });
                return;
            }

            const tokenValidationResult = await this.#authService.authenticateJWT(token);

            if (!tokenValidationResult.isAuth) {
                callback({ status: 401, error: "Expired/Invalid Token" });
                return;
            }

            const user = await this.#voterService.findById(tokenValidationResult.userId);

            if (!user) {
                callback({ status: 403, error: "Expired/Invalid Token" });
                return;
            }

            const votedCategoryIds = (await this.#voteService.getVoterCategories(user.id)).map(votedCategory => votedCategory.CategoryId);
            const categories = (await this.#categoryService.fetchAll({}))
                .filter(category => !votedCategoryIds.includes(category.id))
                .map(({ id, name }) => ({ id, name }));

            callback({ status: 200, user: { userId: user.id, categories } });
        } catch (err) {
            this.#logger.error(err);
            callback({status: 500, error: "Internal Server Error"});
        }
    }
}

module.exports = UserService;