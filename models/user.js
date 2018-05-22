'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        is_bot: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
        },
        language_code: {
            type: DataTypes.STRING,
        },
        selected_language_code: {
            type: DataTypes.STRING,
        },
        timer: {
            type: DataTypes.TINYINT,
        },
        state: {
            type: DataTypes.STRING,
        }
    }, {});


    // User.associate = function (models) {
    //     // associations can be defined here
    // };
    return User;
};