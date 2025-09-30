const { Sequelize } = require("sequelize");
const dbConfig = require("./config")[process.env.NODE_ENV || "development"];

let sequelize;

if (dbConfig.use_env_variable) {
  
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], {
    dialect: "postgres",
    dialectOptions: dbConfig.dialectOptions || {},
    logging: false,
  });
} else {

  sequelize = new Sequelize(
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
}

module.exports = sequelize;
