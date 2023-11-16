const VoteEntity = require("../entities/Vote");
const SeatEntity = require("../entities/Seat");
const Helper = require("../utils/Helper");
const Service = require("./Service");

let instance;

class SeatService extends Service {

    #helper;

    constructor () {
        if (instance) return instance;

        super(SeatEntity);
        this.#helper = new Helper();

        instance = this;
    }

    getSeatCount = async () => {
        return await SeatEntity.count();
    }

    getLevelCount = async (level) => {
        return await SeatEntity.count({
            where: {
                level: level
            }
        })
    }

    getSeatDetailByEmail = async (email) => {
        return await SeatEntity.findOne({
            where: {
                emailAddress: email,
            }
        })
    }

    getSeatDetailByMatricNo = async (matricNo) => {
        return await SeatEntity.findOne({
            where: {
                matricNo: matricNo,
            }
        })
    }

    getSeatDetailByRegno = async (regNo) => {
        return await SeatEntity.findOne({
            where: {
                regNo: regNo,
            }
        })
    }
}

module.exports = SeatService;