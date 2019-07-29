module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        email: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        coupleId: { type: DataTypes.INTEGER, allowNull: true }
    });

    User.associate = function (models) {
        models.User.belongsTo(models.Couple, {
            foreignKey: {
                name: 'coupleId',
            }
        });
    };

    return User;
};