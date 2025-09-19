const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Item = sequelize.define(
  "Item",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING },
    type: { type: DataTypes.ENUM("swap", "donate", "sell"), allowNull: false },
    photos: { type: DataTypes.ARRAY(DataTypes.STRING) },
    status: {
      type: DataTypes.ENUM("available", "swapped", "removed"),
      defaultValue: "available",
    },
  },
  {
    tableName: "Items",
    timestamps: true,
  }
);

module.exports = Item;
