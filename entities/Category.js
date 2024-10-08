const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const Associate = require("./Association");

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

Associate.hasMany(Category);
Category.belongsTo(Associate);

module.exports = Category;