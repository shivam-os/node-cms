module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("role", {
    roleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Role;
};
