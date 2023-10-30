const nodemailer = require("nodemailer");
const Helper = require("./Helper");
const { infrastructure } = require("../config/main.settings");

let instance;

class Messenger {
  #transporter;
  #helper;
  constructor() {
    if (instance) return instance;

    this.#transporter = nodemailer.createTransport({
      host: infrastructure.nodemailer.host,
      port: infrastructure.nodemailer.port,
      auth: {
        user: infrastructure.nodemailer.username,
        pass: infrastructure.nodemailer.password,
      },
    });

    this.#helper = new Helper();

    instance = this;
  }

  mail = async (payload) => {
    try {
      const data = {
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        from: `no_reply@lusc.bakare.tech`
      };

      if (payload.attachments) data.attachments = payload.attachments;

      this.#transporter.sendMail(data, async function (error, body) {
        let helper = new Helper();
        if (error) {
          helper.logError(error);
        }
      });
    } catch (ex) {
      this.#helper.logError(ex);
      return false;
    }
  };
}

module.exports = Messenger;
