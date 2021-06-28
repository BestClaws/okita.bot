import {Sequelize, DataTypes} from "sequelize";


const sequelize = new Sequelize('database', 'username', 'password', {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "../database.sqlite"
});

require("./models/Points")(sequelize, DataTypes);
require("./models/UserCommands")(sequelize, DataTypes);
require("./models/Say")(sequelize, DataTypes);
require("./models/Albums")(sequelize, DataTypes);

// cli args
const force = process.argv.includes("--force");


// sync model to db.
sequelize.sync({force})
    .catch(e => console.log(e));