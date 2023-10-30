const Sequelize = require("sequelize");
const Helper = require("../utils/Helper");
class Service {
  #entity;
  #helper;

  constructor(entity) {
    this.#entity = entity;
    this.#helper = new Helper();
  }

  create = async (data) => {
    let response;
    try {
      response = await this.#entity.create(data);
      return response;
    } catch (e) {
      response = e;
      return response;
    }
  };

  update = async (id, data) => {
    let response = await this.#entity.update(data, { where: { id } });
    return response;
  };

  delete = async (id) => {
    let response = await this.#entity.destroy({ where: { id } });
    return response;
  };

  findById = async (id) => {
    let response = await this.#entity.findByPk(id);

    return response;
  };

  fetchAll = async (query) => {
    try {
      let response;
      response = await this.#entity.findAndCountAll({
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
    } catch (e) {
      this.#helper.logError(e)
    }
  };

  getRecordCount = async () => {
    return await this.#entity.count();
  };

  insertBulk = async (bulk) => {
    return await this.#entity.bulkCreate(bulk).catch((e) => this.#helper.logError(e));
  };
}

module.exports = Service;
