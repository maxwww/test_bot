const userMiddleware = require('./middlewares/userMiddleware');
const { languages, mainMenu, settingMenu } = require('./config/config');
const Telegraf = require('telegraf');
const path = require('path');
const I18n = require('telegraf-i18n');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');


const bot = new Telegraf(process.env.BOT_TOKEN);
const i18n = new I18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: path.resolve(__dirname, 'locales')
});

bot.use(i18n.middleware());
bot.use(userMiddleware());
bot.start((ctx) => {
    return renderLangKeyboard(ctx, i18n.t(ctx.user.language_code, 'description'));
});


bot.on('message', (ctx) => {
    let lang = ctx.user.selected_language_code;
    let text = i18n.t(lang, 'not_found');
    let keyboard;
    if (ctx.message.text.indexOf(mainMenu.button_schedule) === 0) {
        text = 'button_schedule';
    } else if (ctx.message.text.indexOf(mainMenu.button_notification) === 0) {
        text = 'button_notification';
    } else if (ctx.message.text.indexOf(mainMenu.button_settings) === 0) {
        text = i18n.t(lang, 'current_settings', {
            language: languages[lang].lang,
            timer: '15 мин'
        });
        keyboard = Markup
            .keyboard([
                [
                    `${settingMenu.button_language} ${i18n.t(lang, 'button_language')}`,
                    `${settingMenu.button_timer} ${i18n.t(lang, 'button_timer')}`,
                ], [
                    `${settingMenu.button_home} ${i18n.t(lang, 'button_home')}`,
                ]
            ])
            .oneTime()
            .resize()
            .extra();
    } else if (ctx.message.text.indexOf(settingMenu.button_language) === 0) {
        return renderLangKeyboard(ctx, i18n.t(lang, 'changing_language'));
    } else if (ctx.message.text.indexOf(settingMenu.button_home) === 0) {

        let text = i18n.t(lang, 'main_page');
        return renderMainPage(ctx, text, lang);

    } else if (lang = Object.keys(languages).find(key => `${languages[key].emoji} ${languages[key].lang}` === ctx.message.text)) {
        ctx.user.selected_language_code = lang;
        text = i18n.t(lang, 'language_saved');
        return renderMainPage(ctx, text, lang);
    }

    return ctx.reply(text, keyboard);
});

bot.startPolling();

function renderLangKeyboard(ctx, text) {
    let keyboard = [];
    for (let key in languages) {
        keyboard.push([`${languages[key].emoji} ${languages[key].lang}`]);
    }
    return ctx.reply(text, Markup
        .keyboard(keyboard)
        // .oneTime()
        .resize()
        .extra()
    );
}

function renderMainPage(ctx, text, lang) {
    let keyboard = Markup
        .keyboard([
            [
                `${mainMenu.button_schedule} ${i18n.t(lang, 'button_schedule')}`,
                `${mainMenu.button_notification} ${i18n.t(lang, 'button_notification')}`
            ],
            [
                `${mainMenu.button_settings} ${i18n.t(lang, 'button_settings')}`
            ],
        ])
        .oneTime()
        .resize()
        .extra();

    return ctx.reply(text, keyboard);
}