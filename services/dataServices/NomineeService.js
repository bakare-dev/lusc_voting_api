const CategoryEntity = require("../../entities/Category");
const NomineeEntity = require("../../entities/Nominee");
const Helper = require("../../utils/Helper");
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
            include: [ CategoryEntity ],
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

    getNominees = async (query) => {
        let response;
        response = await NomineeEntity.findAndCountAll({
            order: [["createdAt", "DESC"]],
            include: [ CategoryEntity ],
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

    getNominee = async (query) => {
        return await NomineeEntity.findOne({
            where: {
                id: query.id,
                CategoryId: query.categoryId
            }
        })
    }

    getNomineeByMatriNo = async (query) => {
        return await NomineeEntity.findOne({
            where: {
                matricNo: query.matricNo,
                CategoryId: query.CategoryId
            }
        })
    }

    getNomineeByEmail = async (query) => {
        return await NomineeEntity.findOne({
            where: {
                emailAddress: query.emailAddress,
                CategoryId: query.CategoryId
            }
        })
    }
}

module.exports = NomineeService;