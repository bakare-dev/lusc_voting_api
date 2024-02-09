const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");

const db = new DatabaseEngine();

class Associate extends Model {};

Associate.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

module.exports = Associate;