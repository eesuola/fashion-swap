const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CulturalPost = sequelize.define(
  "CulturalPost",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    story: { type: DataTypes.TEXT },
    region: { type: DataTypes.STRING },
    outfitType: { type: DataTypes.ENUM, values: ["Casual", "Wedding", "Traditional", "Ceremonial", "Festival"] },
    photos: { type: DataTypes.ARRAY(DataTypes.STRING) },
    likesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "CulturalPosts",
    timestamps: true,
  }
);

module.exports = CulturalPost;
