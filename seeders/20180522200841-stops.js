'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Stops', [
            {
                id: 1,
                streetId: 1,
                description: JSON.stringify({
                    en: "Stop #1",
                    ru: "Остановка #1",
                    uk: "Зупинка #1"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 2,
                streetId: 1,
                description: JSON.stringify({
                    en: "Stop #2",
                    ru: "Остановка #2",
                    uk: "Зупинка #2"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 3,
                streetId: 1,
                description: JSON.stringify({
                    en: "Stop #3",
                    ru: "Остановка #3",
                    uk: "Зупинка #3"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 4,
                streetId: 1,
                description: JSON.stringify({
                    en: "Stop #4",
                    ru: "Остановка #4",
                    uk: "Зупинка #4"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 5,
                streetId: 2,
                description: JSON.stringify({
                    en: "Stop #5",
                    ru: "Остановка #5",
                    uk: "Зупинка #5"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 6,
                streetId: 2,
                description: JSON.stringify({
                    en: "Stop #6",
                    ru: "Остановка #6",
                    uk: "Зупинка #6"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 7,
                streetId: 2,
                description: JSON.stringify({
                    en: "Stop #7",
                    ru: "Остановка #7",
                    uk: "Зупинка #7"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 8,
                streetId: 2,
                description: JSON.stringify({
                    en: "Stop #8",
                    ru: "Остановка #8",
                    uk: "Зупинка #8"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Stops', null, {});
    }
};
