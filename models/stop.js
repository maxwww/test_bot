'use strict';
module.exports = (sequelize, DataTypes) => {
    var Stop = sequelize.define('Stop', {
        description: DataTypes.TEXT
    }, {});
    Stop.associate = function (models) {
        this.belongsTo(models.Street);
        this.belongsToMany(models.Trolleybus, { through: 'Trolleybus_Stop', as: 'trolleybuses' });
    };
    return Stop;
};