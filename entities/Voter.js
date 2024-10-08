const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Associate = require("./Association");

const db = new DatabaseEngine();

class Voter extends Model {};

Voter.init(
    {
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        matricNo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        session: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

Associate.hasMany(Voter);
Voter.belongsTo(Associate);

module.exports = Voter;