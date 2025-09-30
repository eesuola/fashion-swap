const { Sequelize } = require("sequelize");
const dbConfig = require("../config/config.js")[process.env.NODE_ENV || "development"];


const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

// Import models 
const User = require("./user.model")(sequelize, Sequelize.DataTypes);
const Item = require("./item.model")(sequelize, Sequelize.DataTypes);
const SwapRequest = require("./swapRequest.model")(sequelize, Sequelize.DataTypes);
const CulturalPost = require("./culturalPost.model")(sequelize, Sequelize.DataTypes);
const Comment = require("./comment.model")(sequelize, Sequelize.DataTypes);
const Message = require("./message.model")(sequelize, Sequelize.DataTypes);

// ---------------- Associations ----------------

// User ↔ Item
User.hasMany(Item, { foreignKey: "ownerId", as: "items" });
Item.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// User ↔ SwapRequest
User.hasMany(SwapRequest, { foreignKey: "fromUserId", as: "sentRequests" });
User.hasMany(SwapRequest, { foreignKey: "toUserId", as: "receivedRequests" });
SwapRequest.belongsTo(User, { as: "fromUser", foreignKey: "fromUserId" });
SwapRequest.belongsTo(User, { as: "toUser", foreignKey: "toUserId" });

// SwapRequest ↔ Item (dual items)
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
