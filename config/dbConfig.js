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
db.customers = require("../models/customerModel")(sequelize, DataTypes);

db.diamonds = require("../models/products/diamond/diamondModel")(
  sequelize,
  DataTypes
);
db.diamondVariants = require("../models/products/diamond/diamondVariantsModel")(
  sequelize,
  DataTypes
);

db.melees = require("../models/products/melee/meleeModel")(
  sequelize,
  DataTypes
);
db.sieveSize = require("../models/products/melee/sieveSizeModel")(
  sequelize,
  DataTypes
);

db.colorStone = require("../models/products/colorStone/colorStoneModel")(
  sequelize,
  DataTypes
);
db.colorStoneVariants =
  require("../models/products/colorStone/colorStoneVariants")(
    sequelize,
    DataTypes
  );

db.cuts = require("../models/products/cut/cutModel")(sequelize, DataTypes);
db.cutVariants = require("../models/products/cut/cutVariants")(
  sequelize,
  DataTypes
);

db.layout = require("../models/products/layout/layoutModel")(
  sequelize,
  DataTypes
);
db.diamondDetails = require("../models/products/layout/diamondDetails")(
  sequelize,
  DataTypes
);

db.alphabets = require("../models/products/alphabet/alphabetModel")(
  sequelize,
  DataTypes
);
db.alphabetVariants =
  require("../models/products/alphabet/alphabetVariantsModel")(
    sequelize,
    DataTypes
  );

db.medias = require("../models/products/media/mediaModel")(
  sequelize,
  DataTypes
);

// ASSOCIATIONS START

db.admin.hasMany(db.sessions, {
  foreignKey: "userId",
  constraints: false,
});

db.customers.hasMany(db.sessions, {
  foreignKey: "userId",
  constraints: false,
});

db.diamonds.hasMany(db.diamondVariants, {
  foreignKey: "diamondId",
});
db.diamondVariants.belongsTo(db.diamonds, {
  foreignKey: "diamondId",
});

db.melees.hasMany(db.sieveSize, {
  foreignKey: "meleeId",
});
db.sieveSize.belongsTo(db.melees, {
  foreignKey: "meleeId",
});

db.colorStone.hasMany(db.colorStoneVariants, {
  foreignKey: "colorStoneId",
});
db.colorStoneVariants.belongsTo(db.colorStone, {
  foreignKey: "colorStoneId",
});

db.cuts.hasMany(db.cutVariants, {
  foreignKey: "cutId",
});
db.cutVariants.belongsTo(db.cuts, {
  foreignKey: "cutId",
});

db.layout.hasMany(db.diamondDetails, {
  foreignKey: "layoutId",
});
db.diamondDetails.belongsTo(db.layout, {
  foreignKey: "layoutId",
});

db.alphabets.hasMany(db.alphabetVariants, {
  foreignKey: "alphabetId",
});
db.alphabetVariants.belongsTo(db.alphabets, {
  foreignKey: "alphabetId",
});

// ASSOCIATIONS END

db.sequelize.sync({ alter: true }).then(() => {
  console.log("### RESYNCED ###");
});

module.exports = db;
