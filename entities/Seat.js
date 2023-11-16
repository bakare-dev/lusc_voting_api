const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const CategoryEntity = require("./Category");
const SeatEntity = require("./Seat");
const NomineeEntity = require("./Nominee");

const db = new DatabaseEngine();

class Seat extends Model {};

Seat.init(
    {
        firstName: {
           type: DataTypes.STRING(),
           allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        matricNo: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        emailAddress: {
            type: DataTypes.STRING(),
            allowNull: false
        },
        regNo: {
            type: DataTypes.INTEGER(),
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER(),
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

module.exports = Seat;