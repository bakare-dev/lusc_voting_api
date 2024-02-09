const Mailer = require("../utils/Mailer");

let instance;
class NotificationService {

    #mailer;

    constructor() {

        if (instance) return instance;

        this.#mailer = new Mailer();

        instance = this;

    }

    sendVerifyRegistration = async (message, callback) => {

       
        message.recipients.forEach(async (item) => {

            let info = {
                sender: "no_reply@nacos.bakare.tech",
                templateFile: "registration.ejs",
                subject: "Voting Registration Successfully",
                recipients: item,
                data: message.data
            }

            this.#mailer.sendMail(info, (response) => {
                callback(response);
            })

        })


    }
}

module.exports = NotificationService;