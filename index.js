const models = require('./models');
const userMiddleware = require('./middlewares/userMiddleware');


const Telegraf = require('telegraf')
const path = require('path')
const I18n = require('telegraf-i18n')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')


const bot = new Telegraf(process.env.BOT_TOKEN)
const i18n = new I18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: path.resolve(__dirname, 'locales')
})

bot.use(i18n.middleware())
bot.use(userMiddleware())
bot.start((ctx) => {
    return ctx.reply(i18n.t(ctx.user.language_code, 'description'), Markup
        .keyboard([
            ['🇺🇦 Українська мова'],
            ['🇷🇺 Русский язык'],
            ['🇬🇧 English'],
        ])
        .oneTime()
        .resize()
        .extra()
    )
})
bot.hears('🇺🇦 Українська мова', ctx => {
    ctx.user.selected_language_code = 'uk'
    return ctx.reply(i18n.t('uk', 'language_saved'));
})
bot.hears('🇷🇺 Русский язык', ctx => {
    ctx.user.selected_language_code = 'ru'
    return ctx.reply(i18n.t('ru', 'language_saved'));
})
bot.hears('🇬🇧 English', ctx => {
    ctx.user.selected_language_code = 'en'
    return ctx.reply(i18n.t('en', 'language_saved'));
})

bot.startPolling()
