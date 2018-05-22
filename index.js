global.does = Symbol.for('does');
global.goes = Symbol.for('goes');

const userMiddleware = require('./middlewares/userMiddleware');
const routes = require('./config/routes');
const Telegraf = require('telegraf');
const Router = require('telegraf/router');
const I18n = require('telegraf-i18n');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const buttons = require('./constants/buttons');
const path = require('path');
const fs = require('fs');
const models = require('./models');

const langs = [];

fs
    .readdirSync(path.resolve(__dirname, 'locales'))
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file.slice(-5) === '.json');
    })
    .forEach(file => {
        langs.push(file.substring(0, 2));
    });

const bot = new Telegraf(process.env.BOT_TOKEN);
const i18n = new I18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: path.resolve(__dirname, 'locales')
});

const callbackHandler = new Router(({ user, callbackQuery }) => {
    if (!callbackQuery.data) {
        return
    }
    const parts = callbackQuery.data.split(':', 2);
    return {
        route: parts[0],
        state: {
            data: parts[1]
        }
    }
});

callbackHandler.on('cancel', async (ctx) => {
    const lang = ctx.user.selected_language_code;
    const state = ctx.state.data;
    await ctx.answerCbQuery(i18n.t(lang, 'canceled'));
    await ctx.deleteMessage();
    if (routes[state].parent) {
        await renderPage(ctx, routes[state].parent, i18n.t(lang, routes[routes[state].parent].message, ctx.user.dataValues), lang);
    }
});

callbackHandler.on('lang', async (ctx) => {
    const lang = ctx.state.data;
    ctx.user.selected_language_code = lang;
    await ctx.answerCbQuery(i18n.t(lang, 'language_saved'));
    await ctx.deleteMessage();
    await renderPage(ctx, routes.language.parent, i18n.t(lang, routes[routes.language.parent].message, ctx.user.dataValues), lang);
});

callbackHandler.on('timer', async (ctx) => {
    const lang = ctx.user.selected_language_code;
    ctx.user.timer = ctx.state.data;

    await ctx.answerCbQuery(i18n.t(lang, 'timer_saved'));
    await ctx.deleteMessage();
    await renderPage(ctx, routes.timer.parent, i18n.t(lang, routes[routes.timer.parent].message, ctx.user.dataValues), lang);
});

callbackHandler.on('find', async (ctx) => {
    const lang = ctx.user.selected_language_code;

    // let streets = await models.Street.findAll();

    // let stops = await models.Stop.findAll({include: ['trolleybuses']});
    //
    // for (let stop of stops) {
    //     console.log("<<<<");
    //     console.log(stop.id);
    //     for (let trolleybus of stop.trolleybuses) {
    //         console.log(trolleybus.id);
    //     }
    // }

    let trolleybuses = await models.Trolleybus.findAll({include: ['stops']});

    for (let trolleybus of trolleybuses) {
        console.log("<<<<");
        console.log(trolleybus.id);
        for (let stop of trolleybus.stops) {
            console.log(stop.id);
        }
    }

    //
    // await ctx.answerCbQuery(i18n.t(lang, 'timer_saved'));
    // await ctx.deleteMessage();
    // await renderPage(ctx, routes.home, i18n.t(lang, routes.home.message, ctx.user.dataValues), lang);
});

callbackHandler.otherwise((ctx) => ctx.reply('🌯'));


bot.use(i18n.middleware());
bot.use(userMiddleware());
bot.start((ctx) => {
    if (!ctx.user.state) {
        let lang = ctx.user.language_code;
        return renderPage(ctx, routes.home, i18n.t(lang, 'welcome'), lang, false)
    }
    let lang = ctx.user.selected_language_code;

    return renderPage(ctx, routes.home, i18n.t(lang, 'description'), lang);

});


for (let key in routes) {
    let page = routes[key];
    if (page.isEnabled) {
        for (let lang of langs) {
            bot.hears(`${page.emoji} ${i18n.t(lang, page.button_text)}`, ctx => {
                return renderPage(ctx, page, i18n.t(lang, page.message, ctx.user.dataValues), lang);
            })
        }
    }
}


bot.on('message', (ctx) => {
    let lang = ctx.user.selected_language_code;
    return renderPage(ctx, routes.home, "Home page", lang);
});

bot.on('callback_query', callbackHandler);


bot.startPolling();

function renderPage(ctx, page, text, lang, withCancel = true) {
    if (typeof page === 'string') {
        if (page in routes) {
            page = routes[page];
        } else {
            page = false;
        }

    }
    if (page && Object.keys(page).length !== 0) {
        ctx.user.state = page.slug;
        let keyboard;
        if (page.keyboard && page.keyboard.keys.length > 0) {
            keyboard = [];
            if (page.keyboard.type === goes) {
                for (let row of page.keyboard.keys) {
                    let rowKeys = [];
                    for (let col of row) {
                        if (col in routes) {
                            rowKeys.push(`${buttons[col]} ${i18n.t(lang, routes[col]['button_text'])}`)
                        }
                    }
                    keyboard.push(rowKeys);
                }
                keyboard = Markup
                    .keyboard(keyboard)
                    .oneTime()
                    .resize()
                    .extra();
            } else if (page.keyboard.type === does) {
                keyboard = Extra
                    .HTML()
                    .markup((m) => {
                        let callbackButtons = page.keyboard.keys.map((key) => {
                            return m.callbackButton(`${key.title.emoji} ${i18n.t(lang, key.title.text, key.title.data)}`, key.action);
                        });
                        if (withCancel) {
                            callbackButtons.push(m.callbackButton(`${buttons.cancel} ${i18n.t(lang, 'button_cancel')}`, `cancel:${page.slug}`));
                        }
                        return m.inlineKeyboard(callbackButtons, { columns: page.keyboard.columns });
                    });
            }
        }
        return ctx.reply(text, keyboard);
    } else {
        renderPage(ctx, routes.notFound, i18n.t(lang, 'notFound'), lang)
    }
}
