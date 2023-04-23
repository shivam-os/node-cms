const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

//Create connection to the database using given credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

//Check the connection to the database
const checkDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database successfully.");
  } catch (err) {
    console.log("Error while connecting to the database:", err);
  }
};
checkDBConnection();

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};

//Sync all the tables with the database
const syncAllTables = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("All the tables are synced syccessfully.");
  } catch (err) {
    console.log("Error in syncing the table:", err);
  }
};
syncAllTables();

//Add the models to the above db object
db.role = require("../models/role")(sequelize, DataTypes);
db.user = require("../models/user")(sequelize, DataTypes);
db.post = require("../models/post")(sequelize, DataTypes);
db.category = require("../models/category")(sequelize, DataTypes);

//Create associations between the models
db.role.hasMany(db.user, { foreignKey: "roleId" });
db.user.hasMany(db.post, { foreignKey: "userId" });
db.category.hasMany(db.post, { foreignKey: "categoryId" });

module.exports = db;
