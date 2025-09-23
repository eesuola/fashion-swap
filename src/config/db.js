const { Sequelize } = require("sequelize");
const isTest = process.env.NODE_ENV === "test";
require("dotenv").config();

const sequelize = new Sequelize(
  isTest ? process.env.TEST_DB_DATABASE : process.env.DB_DATABASE || "fashion_swap",
  isTest ? process.env.TEST_DB_USERNAME : process.env.DB_USERNAME || "postgres",
  process.env.DB_PASSWORD || "password",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: console.log,
  }
);

module.exports = sequelize;
