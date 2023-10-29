const CategoryEntity = require("../entities/Category");
const Service = require("./Service");

let instance;

class CategoryService extends Service {

    constructor () {
        if (instance) return instance;

        super(CategoryEntity)

        instance = this;
    }


}

module.exports = CategoryService;