'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Trolleybus_Stop', [
            {
                id: 1,
                trolleybusId: 1,
                stopId: 1,
                time: 360,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 2,
                trolleybusId: 1,
                stopId: 2,
                time: 385,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 3,
                trolleybusId: 1,
                stopId: 3,
                time: 395,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 4,
                trolleybusId: 1,
                stopId: 4,
                time: 420,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 5,
                trolleybusId: 1,
                stopId: 1,
                time: 435,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 6,
                trolleybusId: 1,
                stopId: 2,
                time: 460,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 7,
                trolleybusId: 1,
                stopId: 3,
                time: 470,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 8,
                trolleybusId: 1,
                stopId: 4,
                time: 495,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 9,
                trolleybusId: 2,
                stopId: 5,
                time: 370,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 10,
                trolleybusId: 2,
                stopId: 6,
                time: 430,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 11,
                trolleybusId: 2,
                stopId: 7,
                time: 440,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 12,
                trolleybusId: 2,
                stopId: 8,
                time: 500,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 13,
                trolleybusId: 2,
                stopId: 5,
                time: 570,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 14,
                trolleybusId: 2,
                stopId: 6,
                time: 630,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 15,
                trolleybusId: 2,
                stopId: 7,
                time: 640,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 16,
                trolleybusId: 2,
                stopId: 8,
                time: 700,
                days: 127,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Trolleybus_Stop', null, {});

    }
};
