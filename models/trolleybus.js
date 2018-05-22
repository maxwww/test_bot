'use strict';
module.exports = (sequelize, DataTypes) => {
    var Trolleybus = sequelize.define('Trolleybus', {
        name: DataTypes.STRING,
        description: DataTypes.TEXT

    }, {});
    Trolleybus.associate = function (models) {
        this.belongsToMany(models.Stop, { through: 'Trolleybus_Stop', as: 'stops' });
    };
    return Trolleybus;
};