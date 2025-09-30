module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      postId: { type: DataTypes.UUID, allowNull: false },
      userId: { type: DataTypes.UUID, allowNull: false },
      text: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: "Comments",
      timestamps: true,
    }
  );

  return Comment;
};
