'use strict';
module.exports = (sequelize, DataTypes) => {
    var Street = sequelize.define('Street', {
        description: DataTypes.TEXT
    }, {});

    return Street;
};