module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fromUserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      toUserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "Messages",
      timestamps: true,
    }
  );

  return Message;
};
