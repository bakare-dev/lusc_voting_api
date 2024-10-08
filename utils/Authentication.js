const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const { security, infrastructure } = require("../config/main.settings");

let instance;
class Authenticate {
  #key;

  constructor() {
    if (instance) return instance;
    this.#key = security.jwt;

    instance = this;
  }

  authenticateJWT = async (token) => {
    let response = {};
    try {
      const decodedToken = jwt.verify(token, this.#key);

      if (!decodedToken) {
        response.isAuth = false;
        response.error = "Invalid token";
        return response;
      }

      response.isAuth = true;
      response.userId = decodedToken.userId;
      return response;
    } catch (err) {
      console.log(err);
      if (err.name === "TokenExpiredError") {
        response.isAuth = false;
        response.error = "Token has expired";
      } else if (err.name === "JsonWebTokenError") {
        response.isAuth = false;
        response.error = "Invalid token";
      } else {
        response.isAuth = false;
        response.error = "Authentication failed";
      }

      return response;
    }
  };

  generateTokens = (userId, callback) => {
    const currentDate = new Date();
    const expirationDate = new Date("2024-02-11T23:59:59Z");

    const expiresIn = Math.floor((expirationDate - currentDate) / 1000);

    const token = jwt.sign({ userId: userId }, security.jwt, {
      expiresIn: expiresIn,
    });

    callback(token);
  };
}

module.exports = Authenticate;
