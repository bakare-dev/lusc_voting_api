const DatabaseEngine = require("../utils/DatabaseEngine");
const { Model, DataTypes} = require("sequelize");
const CategoryEntity = require("./Category");
const VoterEntity = require("./Voter");
const NomineeEntity = require("./Nominee");

const db = new DatabaseEngine();

class Vote extends Model {};

Vote.init(
    {
        

    },
    {
        sequelize: db.getConnectionManager()
    }
)

CategoryEntity.hasMany(Vote, {
    foreignKey: {
        allowNull: false
    }
})
Vote.belongsTo(CategoryEntity);

VoterEntity.hasMany(Vote, {
    foreignKey: {
        allowNull: false
    }
})
Vote.belongsTo(VoterEntity);

NomineeEntity.hasMany(Vote, {
    foreignKey: {
        allowNull: false
    }
})
Vote.belongsTo(NomineeEntity)

module.exports = Vote;