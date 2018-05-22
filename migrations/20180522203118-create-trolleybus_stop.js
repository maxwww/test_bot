'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Trolleybus_Stop', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            trolleybusId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Trolleybuses',
                    key: 'id'
                },
                allowNull: false
            },
            stopId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Stops',
                    key: 'id'
                },
                allowNull: false
            },
            time: {
                type: Sequelize.INTEGER,
            },
            days: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Trolleybus_Stop');
    }
};