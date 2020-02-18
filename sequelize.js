// sequelize.js
const Sequelize = require("sequelize");
const config = require("config");

// Note that you must use a SQL Server login -- Windows credentials will not work.
const sequelize = new Sequelize(
  process.env.initialCatalog || config.get("Sql.InitialCatalog"),
  process.env.sqlUser || config.get("Sql.SqlUsername"),
  process.env.sqlPassword || config.get("Sql.SqlPassword"),
  {
    dialect: "mssql",
    host: process.env.sqlHost || config.get("Sql.SqlHost"),
    port: process.env.sqlPort || config.get("Sql.SqlPort"), // Default port,
    dialectOptions: {
      options: {
        encrypt: process.env.NODE_ENV ? true : false
      }
    },
    pool: {
      max: 50,
      min: 0,
      idle: 10000
    }
  }
);

// Models
const User = sequelize.define(
  "Users",
  {
    // attributes
    Id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    CreatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    UpdatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    // options
    modelName: "Users",
    timestamps: false,
    tableName: "Users",
    modelName: "Users"
  }
);

module.exports = { sequelize, User };
