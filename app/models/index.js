const config = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAlises: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/auth/user.model')(sequelize, Sequelize);
db.role = require('../models/auth/role.model')(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});

db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.ROLES = ["user", "admin"];

db.payment = require('../models/payment.model')(sequelize, Sequelize);

db.user.hasMany(db.payment, { as: "payments" });
db.payment.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user"
});

db.parking_lot = require('../models/parking_lot.model')(sequelize, Sequelize);

db.parking_lot.hasMany(db.payment, { as: "payments" });
db.payment.belongsTo(db.parking_lot, {
    foreignKey: "parkingLotId",
    as: "parkingLot"
});

module.exports = db;