module.exports = (sequelize, DataTypes) => {
  const SwapRequest = sequelize.define(
    "SwapRequest",
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
      fromItemId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      toItemId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "declined", "completed"),
        defaultValue: "pending",
      },
    },
    {
      tableName: "SwapRequests",
      timestamps: true,
    }
  );

  return SwapRequest;
};
