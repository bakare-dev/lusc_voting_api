const { infrastructure } = require("../config/main.settings");

let instance;

class IPRestriction {
  #allowedIPAddress;

  constructor() {
    if (instance) return instance;

    this.#allowedIPAddress = infrastructure.ip;

    instance = this;
  }

  restrictToIPAddress = (req, res, next) => {
    const clientIPAddress = req.ip;

    if (req.path.startsWith("/api/v1/election/categories") || req.path.startsWith("/api/v1/election/vote/category")) {
      next();
      return;
    }
    if (clientIPAddress.startsWith("196.223")) {
      next();
    } else {
      res
        .status(403)
        .json({ error: "connect to school's wifi to complete this process" });
    }
  };
}

module.exports = IPRestriction;
