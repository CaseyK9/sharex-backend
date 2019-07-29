module.exports = (sequelize, DataTypes) => {
    var Expense = sequelize.define('Expense', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            onDelete: 'cascade',
            allowNull: false,
            primaryKey: true
        },
        createdAt: DataTypes.DATE,
        breakdown: DataTypes.STRING,
        title: DataTypes.STRING,
        total: {
            type: DataTypes.DECIMAL,
            get () {
                return Number(this.getDataValue('total'));
            }
        },
        category: DataTypes.STRING
    }, {
        charset: 'utf8',
    });

    Expense.associate = function (models) {
        models.Expense.belongsTo(models.Couple, {
            foreignKey: {
                name: 'coupleId',
            }
        });
    };

    return Expense;
};