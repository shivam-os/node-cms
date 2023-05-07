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
    port: process.env.DB_PORT,
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
    await db.sequelize.sync();
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
db.user.belongsTo(db.role, { foreignKey: "roleId" });
db.post.belongsTo(db.user, { foreignKey: "userId" });
db.post.belongsTo(db.category, { foreignKey: "categoryId" });

//Create roles
const createRoles = async () => {
  try {
    //Count the role ids
    const roleCount = await db.role.count();
    console.log("count", roleCount);

    if (roleCount === 0) {
      await db.role.create({ name: "author" });
      //Create admin role
      await db.role.create({ name: "editor" });
      //Create super role
      await db.role.create({ name: "admin" });
      //Create default category
      await db.category.create({ name: "uncategorized" });
    }
  } catch (err) {
    console.log("Error in inserting the data into role table", err);
  }
};
createRoles();

module.exports = db;
