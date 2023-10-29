const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");

const db = new DatabaseEngine();

class Category extends Model {};

Category.init(
    {
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },

    },
    {
        sequelize: db.getConnectionManager()
    }
)

module.exports = Category;