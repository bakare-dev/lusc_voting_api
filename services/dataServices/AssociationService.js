const AssociationEntity = require("../../entities/Association");
const Service = require("./Service");

let instance;

class AssociationService extends Service {

    constructor () {
        if (instance) return instance;

        super(AssociationEntity)

        instance = this;
    }


}

module.exports = AssociationService;