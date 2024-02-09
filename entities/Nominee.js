const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const CategoryEntity = require("./Category");

const db = new DatabaseEngine();

class Nominee extends Model {};

Nominee.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        matricNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pictureUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize: db.getConnectionManager()
    }
)

CategoryEntity.hasMany(Nominee, {
    foreignKey: {
        allowNull: false
    }
})
Nominee.belongsTo(CategoryEntity)

module.exports = Nominee;