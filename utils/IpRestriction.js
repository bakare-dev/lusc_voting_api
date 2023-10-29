const { infrastructure } = require("../config/main.settings");


let instance;

class IPRestriction {

    #allowedIPAddress

    constructor () {
        if (instance) return instance;

        this.#allowedIPAddress = infrastructure.ip;

        instance = this
    }

    restrictToIPAddress = (req, res, next) => {
        const clientIPAddress = req.ip;
        
        if (clientIPAddress === allowedIPAddress) {
          next();
        } else {
          res.status(403).send('Access Forbidden');
        }
    };
}

module.exports = IPRestriction;