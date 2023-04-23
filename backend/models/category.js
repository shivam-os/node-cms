module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("category", {
    categoryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Category;
};
