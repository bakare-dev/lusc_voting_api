const AdminEntity = require("../../entities/Admin");
const Service = require("./Service");

let instance;

class AdminService extends Service {

    constructor () {
        if (instance) return instance;

        super(AdminEntity)

        instance = this;
    }


}

module.exports = AdminService;