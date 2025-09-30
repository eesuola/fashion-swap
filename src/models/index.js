const { Sequelize } = require("sequelize");
const dbConfig = require("../../config/config.js")[process.env.NODE_ENV || "development"];

let sequelize;

if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

// Import models
const User = require("./user.model");
const Item = require("./item.model");
const SwapRequest = require("./swapRequest.model");
const CulturalPost = require("./culturalPost.model");
const Comment = require("./comment.model");
const Message = require("./message.model");

// ---------------- Associations ----------------

// User ↔ Item
User.hasMany(Item, { foreignKey: "ownerId", as: "items" });
Item.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// User ↔ SwapRequest
User.hasMany(SwapRequest, { foreignKey: "fromUserId", as: "sentRequests" });
User.hasMany(SwapRequest, { foreignKey: "toUserId", as: "receivedRequests" });
SwapRequest.belongsTo(User, { as: "fromUser", foreignKey: "fromUserId" });
SwapRequest.belongsTo(User, { as: "toUser", foreignKey: "toUserId" });

// SwapRequest ↔ Item
SwapRequest.belongsTo(Item, { as: "fromItem", foreignKey: "fromItemId" });
SwapRequest.belongsTo(Item, { as: "toItem", foreignKey: "toItemId" });

// User ↔ CulturalPost
User.hasMany(CulturalPost, { foreignKey: "userId", as: "posts" });
CulturalPost.belongsTo(User, { foreignKey: "userId", as: "author" });

// CulturalPost ↔ Comment
CulturalPost.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(CulturalPost, { foreignKey: "postId", as: "post" });

// User ↔ Comment
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "commenter" });

// User ↔ Message
User.hasMany(Message, { foreignKey: "fromUserId", as: "sentMessages" });
User.hasMany(Message, { foreignKey: "toUserId", as: "receivedMessages" });
Message.belongsTo(User, { as: "fromUser", foreignKey: "fromUserId" });
Message.belongsTo(User, { as: "toUser", foreignKey: "toUserId" });

// ---------------- Exports ----------------
module.exports = {
  sequelize,
  Sequelize,
  User,
  Item,
  SwapRequest,
  CulturalPost,
  Comment,
  Message,
};
