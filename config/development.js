module.exports = {
    "dialect": "sqlite",
    "storage": "./db/database.sqlite",


    timer: {
        defaultTimer: 10,
        emoji: '⏱',
        times: [5, 10, 15, 20]
    },


    languages: {
        uk: {
            emoji: '🇺🇦',
            lang: 'Українська мова',
        },
        ru: {
            emoji: '🇷🇺',
            lang: 'Русский язык',
        },
        en: {
            emoji: '🇬🇧',
            lang: 'English',
        }
    },

    buttons: {
        button_schedule: '🚉',
        button_notification: '🔔',
        button_settings: '⚙',
        button_language: '🌐',
        button_timer: '⏰',
        button_home: '🏠',
        button_back: '⬅️'
    },

    mainMenu: {

    },

    settingMenu: {

    }
};