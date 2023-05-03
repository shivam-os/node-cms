module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("post", {
    postId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  });

  return Post;
};
