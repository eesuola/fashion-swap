const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
      // ✅ The item offered by the sender
      type: DataTypes.UUID,
      allowNull: false,
    },
    toItemId: {
      // ✅ The item requested from the receiver
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

module.exports = SwapRequest; // ✅ export the model directly
