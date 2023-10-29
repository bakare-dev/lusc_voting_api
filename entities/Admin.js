const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");

const db = new DatabaseEngine();

class Admin extends Model {};

Admin.init(
    {
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize: db.getConnectionManager()
    }
)

module.exports = Admin;