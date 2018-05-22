'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Trolleybuses', [
            {
                id: 1,
                name: "1",
                description: JSON.stringify({
                    en: "Himprom - Bus station",
                    ru: "Химпром - Автовокзал",
                    uk: "Хімпром - Автовокзал"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 2,
                name: "7",
                description: JSON.stringify({
                    en: "Himprom - Centrolit",
                    ru: "Химпром - Центролит",
                    uk: "Хімпром - Цетроліт"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Trolleybuses', null, {});

    }
};
