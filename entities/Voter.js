const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");

const db = new DatabaseEngine();

class Voter extends Model {};

Voter.init(
    {
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        matricNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        session: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

module.exports = Voter;