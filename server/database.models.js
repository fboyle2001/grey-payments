// Get the exported classes from the sequelize module in node.js
const { Sequelize, Model, DataTypes } = require("sequelize");

// Create an instance of sequelise with the specific database from the .env file
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

// Define the models representing tables in the database

class Users extends Model {}
class GymMemberships extends Model {}

// Sequelize will automatically add IDs, createdAt and changedAt

// No need to store a users email it is simply username@durham.ac.uk
// Wouldn't be difficult to add if it is wanted in the future
Users.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { sequelize });

// Only need to store the length of membership can derive end date
// Considered putting this in the Users table but keeping it separate
// allows for greater expansion of any functionality (e.g. automating the approval process for their cards)
GymMemberships.init({
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id'
    }
  },
  option: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { sequelize });

// Associations are necessary to allow joins between tables

Users.hasMany(GymMemberships, { foreignKey: 'userId' });
GymMemberships.belongsTo(Users, { foreignKey: 'userId' });

module.exports = { Users, GymMemberships }
