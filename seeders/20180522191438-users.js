'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('Users', [
            {
                id: 999999999,
                is_bot: 0,
                first_name: 'Max',
                last_name: 'Max',
                username: 'Max',
                language_code: 'ru',
                selected_language_code: 'ru',
                timer: 13,
                state: '',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});


    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
