'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Streets', [
            {
                id: 1,
                description: JSON.stringify({
                    en: "Charkivs'ka",
                    ru: "Харьковская",
                    uk: "Харьківська"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                id: 2,
                description: JSON.stringify({
                    en: "Bilopil's'kyi Shlyakh",
                    ru: "Белопольский путь",
                    uk: "Білопільський шлях"
                }),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});


    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Streets', null, {});
    }
};
