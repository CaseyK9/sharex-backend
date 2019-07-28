var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var basename = path.basename(__filename);
var dbPassword = require('../secrets').dbPassword;
var db = {};

sequelize = new Sequelize('sharex', 'sharex', dbPassword, {
    dialect: 'mysql',
    host: "sharex.cxhahp0owjuc.us-east-1.rds.amazonaws.com",
    port: 3306,
    define: {
        syncOnAssociation: false,
        timestamps: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    },
    logging: false
    // timezone: timezoneOffset + ':00'
});

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;