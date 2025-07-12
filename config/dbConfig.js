const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.NEXT_APP_DBNAME,
  process.env.NEXT_APP_USERNAME,
  process.env.NEXT_APP_PASSWORD,

  {
    host: process.env.NEXT_APP_HOST,
    dialect: "mysql",
    logging: false,
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("DB CONNECTED !!");
  })
  .catch((err) => console.log(`Error - ${err}`));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("../models/adminModel")(sequelize, DataTypes);
db.sessions = require("../models/sessionsModel")(sequelize, DataTypes);

// ASSOCIATIONS START

db.admin.hasMany(db.sessions, {
  foreignKey: "userId",
});
db.sessions.belongsTo(db.admin, {
  foreignKey: "userId",
});

// ASSOCIATIONS END

db.sequelize.sync({ alter: true }).then(() => {
  console.log("### RESYNCED ###");
});

module.exports = db;
