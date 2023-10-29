const NomineeEntity = require("../entities/Nominee");
const Helper = require("../utils/Helper");
const Service = require("./Service");

let instance;

class NomineeService extends Service {

    #helper;

    constructor () {
        if (instance) return instance;

        super(NomineeEntity);
        this.#helper = new Helper();

        instance = this;
    }

    getNomineesByCategory = async (query) => {
        let response;
        response = await NomineeEntity.findAndCountAll({
            where: {
                CategoryId: query.categoryId
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
            response.currentSize = "20";
        }

        return response;
    }
}

module.exports = NomineeService;