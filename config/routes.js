const buttons = require('../constants/buttons');

module.exports = {
    home: {
        slug: 'home',
        button_text: 'button_home',
        emoji: buttons.home,
        parent: null,
        isEnabled: true,
        message: 'description',
        keyboard: {
            type: goes,
            keys: [
                ['schedule', 'notification'],
                ['settings']
            ]
        }
    },
    settings: {
        slug: 'settings',
        button_text: 'button_settings',
        emoji: buttons.settings,
        parent: 'home',
        isEnabled: true,
        message: 'current_settings',
        keyboard: {
            type: goes,
            keys: [
                ['language', 'timer'],
                ['home']
            ]
        }
    },
    language: {
        slug: 'language',
        button_text: 'button_language',
        emoji: buttons.language,
        parent: 'settings',
        isEnabled: true,
        message: 'changing_language',
        keyboard: {
            type: does,
            keys: [
                { title: { text: 'uk_lang', emoji: buttons.ukLang }, action: 'lang:uk' },
                { title: { text: 'ru_lang', emoji: buttons.ruLang }, action: 'lang:ru' },
                { title: { text: 'en_lang', emoji: buttons.enLang }, action: 'lang:en' }
            ],
            columns: 1
        }
    },
    timer: {
        slug: 'timer',
        button_text: 'button_timer',
        emoji: buttons.timer,
        parent: 'settings',
        isEnabled: true,
        message: 'changing_timer',
        keyboard: {
            type: does,
            keys: [
                { title: { text: 'minutes', data: { min: 5 }, emoji: buttons.changeTimer }, action: 'timer:5' },
                { title: { text: 'minutes', data: { min: 10 }, emoji: buttons.changeTimer }, action: 'timer:10' },
                { title: { text: 'minutes', data: { min: 15 }, emoji: buttons.changeTimer }, action: 'timer:15' }
            ],
            columns: 2
        }
    },
    schedule: {
        slug: 'schedule',
        button_text: 'button_schedule',
        emoji: buttons.schedule,
        parent: 'home',
        isEnabled: true,
        message: 'schedule',
        keyboard: {
            type: does,
            keys: [
                { title: { text: 'byBus', emoji: buttons.byBus }, action: 'find:byBus' },
                { title: { text: 'byStreet', emoji: buttons.byStreet }, action: 'find:byStreet' },
            ],
            columns: 2
        }
    },
    notification: {
        slug: 'notification',
        button_text: 'button_notification',
        emoji: buttons.notification,
        parent: 'home',
        isEnabled: true,
        message: 'description',
    },
    notFound: {
        slug: 'notFound',
        isEnabled: false,
        message: 'description',
        keyboard: {
            type: goes,
            keys: [
                ['home']
            ]
        }
    }
};