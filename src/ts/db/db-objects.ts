import { DataTypes, Model, ModelCtor, Sequelize } from "sequelize";

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhsot",
    dialect: "sqlite",
    logging: false,
    storage: "../database.sqlite"
});

export const Points = require("./models/Points")(sequelize, DataTypes);
export const UserCommands = require("./models/UserCommands")(sequelize, DataTypes);