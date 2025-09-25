const { Sequelize } = require("sequelize");
const isTest = process.env.NODE_ENV === "test";
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_DATABASE}`, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: process.env.NODE_ENV === 'production' ? false : console.log
});

module.exports = sequelize;
