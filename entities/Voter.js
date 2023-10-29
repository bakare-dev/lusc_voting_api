const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");

const db = new DatabaseEngine();

class Voter extends Model {};

Voter.init(
    {
        matricNo: {
            type: DataTypes.STRING,
            allowNull: false
        },

    },
    {
        sequelize: db.getConnectionManager()
    }
)

module.exports = Voter;