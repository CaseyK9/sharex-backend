module.exports = (sequelize, DataTypes) => {
    var Couple = sequelize.define('Couple', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            onDelete: 'cascade',
            allowNull: false, 
            primaryKey: true
        }
    });

    // Couple.associate = function (models) {
    //     models.Couple.hasMany(models.User);
    // };

    return Couple;
};