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
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, this.#key);
        } catch (err) {
            response.isAuth = false;
            return response;
        }

        if (!decodedToken) {
            req.isAuth = false;
            return response;
        }

        response.isAuth = true;
        response.userId = decodedToken.userId;
        return response;
    }

    generateTokens = (userId, callback) => {
        let token = jwt.sign({ userId: userId }, security.jwt, {
            expiresIn: '48h'
        }); 
    
        callback(token)
    }
}

module.exports = Authenticate;