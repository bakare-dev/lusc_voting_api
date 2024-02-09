const CategoryEntity = require("../../entities/Category");
const Helper = require("../../utils/Helper");
const Service = require("./Service");

let instance;

class CategoryService extends Service {

    #helper;

    constructor () {
        if (instance) return instance;

        super(CategoryEntity);
        this.#helper = new Helper();

        instance = this;
    }


    getCategoriesByAssociation = async (associateId) => {
        return await CategoryEntity.findAndCountAll({
            where: {
                AssociateId: associateId
            },
            order: [["createdAt", "DESC"]],
        });
    }

}

module.exports = CategoryService;