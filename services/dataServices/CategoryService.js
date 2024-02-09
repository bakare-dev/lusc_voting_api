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
        let response;
        response = await CategoryEntity.findAndCountAll({
            where: {
                AssociateId: associateId
            },
            order: [["createdAt", "DESC"]],
            ...this.#helper.paginate(query.page, query.size),
        });
  
        if (query.page && query.page != "undefined") {
            response.currentPage = query.page;
        } else {
            response.currentPage = "0";
        }
  
        if (query.size && query.size != "undefined") {
            response.currentSize = query.size;
        } else {
            response.currentSize = "50";
        }
  
        return response;
    }

}

module.exports = CategoryService;