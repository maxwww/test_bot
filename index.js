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
    console.log(".............");
    console.log(callbackQuery.data);
    const parts = callbackQuery.data.split(':');
    const route = parts[0];
    parts.shift();
    const data = parts.join(":");
    return {
        route,
        state: {
            data
        }
    }
});

callbackHandler.on('cancel', async (ctx) => {
    const lang = ctx.user.selected_language_code;
    const state = strToData(ctx.state.data).subject;
    await ctx.answerCbQuery(i18n.t(lang, 'canceled'));
    await ctx.deleteMessage();
    if (routes[state]) {
        await renderPage(ctx, routes[state], i18n.t(lang, routes[state].message, ctx.user.dataValues), lang);
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

callbackHandler.on('show', async (ctx) => {
    const lang = ctx.user.selected_language_code;
    const data = strToData(ctx.state.data);
    const page = data.subject;

    await renderPage(ctx, page, i18n.t(lang, routes[page].message, ctx.user.dataValues), lang, true, true);
});

callbackHandler.on('showAllStreets', async (ctx) => {
    const lang = ctx.user.selected_language_code;
    const text = i18n.t(lang, 'selectStreet');
    const state = 'selectStreet';
    const cancelTo = dataToStr({ action: 'cancel', subject: 'home' });
    const backTo = dataToStr({ action: 'show', subject: 'schedule' });
    const streets = await models.Street.findAll();
    const actions = { action: 'stopsOnStreet', previous: 'showAllStreets' };
    const keyboard = makeInlineKeyboard(streets, 'streetId', actions, lang, cancelTo, backTo, 1);

    await reRenderPageWithKeyboard(ctx, text, keyboard, state);
});

callbackHandler.on('stopsOnStreet', async (ctx) => {
    const lang = ctx.user.selected_language_code;
    const data = strToData(ctx.state.data);
    const text = i18n.t(lang, 'selectStop');
    const state = 'selectBusStop';
    const cancelTo = dataToStr({ action: 'cancel', subject: 'home' });
    const backTo = dataToStr({ action: 'showAllStreets' });
    const stops = await models.Stop.findAll({ where: { streetId: data.streetId } });
    const actions = { ...data, action: 'selectStop', previous: 'stopsOnStreet' };
    const keyboard = makeInlineKeyboard(stops, 'stopId', actions, lang, cancelTo, backTo, 1);

    await reRenderPageWithKeyboard(ctx, text, keyboard, state);
});

callbackHandler.on('showAllBuses', async (ctx) => {
    const lang = ctx.user.selected_language_code;

    const text = i18n.t(lang, 'selectBus');
    const state = 'selectBus';
    const cancelTo = dataToStr({ action: 'cancel', subject: 'home' });
    const backTo = dataToStr({ action: 'show', subject: 'schedule' });
    const buses = await models.Trolleybus.findAll();
    const actions = { action: 'stopsByBus', previous: 'showAllBuses' };
    const keyboard = makeInlineKeyboard(buses, 'trolleybusId', actions, lang, cancelTo, backTo, 1);

    await reRenderPageWithKeyboard(ctx, text, keyboard, state);
});

callbackHandler.on('stopsByBus', async (ctx) => {
    const lang = ctx.user.selected_language_code;
    const data = strToData(ctx.state.data);
    const text = i18n.t(lang, 'selectStop');
    const state = 'selectBusStop';
    const cancelTo = dataToStr({ action: 'cancel', subject: 'home' });
    const backTo = dataToStr({ action: 'showAllBuses' });
    const trolleybus = await models.Trolleybus.findOne({
        where: { id: data.trolleybusId },
        include: ['stops']
    });
    const stops = trolleybus.stops;
    const actions = { ...data, action: 'selectStop', previous: 'stopsByBus', subject: null };
    const keyboard = makeInlineKeyboard(stops, 'stopId', actions, lang, cancelTo, backTo, 1);

    await reRenderPageWithKeyboard(ctx, text, keyboard, state);
});

callbackHandler.on('selectStop', async (ctx) => {
    const lang = ctx.user.selected_language_code;
    const data = strToData(ctx.state.data);
    const state = 'showingStop';
    console.log(data);

    const stop = await models.Stop.findById(data.stopId);
    let text = JSON.parse(stop.description)[lang];
    text += '\n\n';
    text += i18n.t(lang, 'actionForStop');

    if (data.previous !== 'stopsOnStreet' && data.previous !== 'stopsByBus') {
        if (data.streetId) {
            data.previous = 'stopsOnStreet';
        } else {
            data.previous = 'stopsByBus'
        }
    }

    const backTo = dataToStr({ ...data, action: data.previous });
    const cancelTo = dataToStr({ action: 'cancel', subject: 'home' });
    const columns = 1;

    const actionsOne = dataToStr({ ...data, action: 'scheduleOne', previous: 'selectStop' });
    const actionsAll = dataToStr({ ...data, action: 'scheduleAll', previous: 'selectStop' });

    const keyboard = Extra
        .HTML()
        .markup((m) => m.inlineKeyboard([
                m.callbackButton('Schedule for one trolleybus', actionsOne),
                m.callbackButton('Schedule for all trolleybuses', actionsAll),
                m.callbackButton(`${buttons.back} ${i18n.t(lang, 'button_back')}`, backTo),
                m.callbackButton(`${buttons.cancel} ${i18n.t(lang, 'button_cancel')}`, cancelTo)
            ], { columns })
        );

    return reRenderPageWithKeyboard(ctx, text, keyboard, state);
});

callbackHandler.on('scheduleOne', async (ctx) => {
    const lang = ctx.user.selected_language_code;
    const data = strToData(ctx.state.data);
    const state = 'showingStop';
    const text = i18n.t(lang, 'selectBus');
    const columns = 1;
    console.log(data);

    const backTo = dataToStr({ ...data, action: data.previous });
    const cancelTo = dataToStr({ action: 'cancel', subject: 'home' });

    const keyboard = Extra
        .HTML()
        .markup((m) => m.inlineKeyboard([
                m.callbackButton(`${buttons.back} ${i18n.t(lang, 'button_back')}`, backTo),
                m.callbackButton(`${buttons.cancel} ${i18n.t(lang, 'button_cancel')}`, cancelTo)
            ], { columns })
        );

    return reRenderPageWithKeyboard(ctx, text, keyboard, state);
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

function renderPage(ctx, page, text, lang, withCancel = true, reRender = false) {
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
                            callbackButtons.push(m.callbackButton(`${buttons.cancel} ${i18n.t(lang, 'button_cancel')}`, `cancel:${page.parent}`));
                        }
                        return m.inlineKeyboard(callbackButtons, { columns: page.keyboard.columns });
                    });
            }
        }
        if (reRender) {
            return ctx.editMessageText(text, keyboard);
        }
        return ctx.reply(text, keyboard);
    } else {
        renderPage(ctx, routes.notFound, i18n.t(lang, 'notFound'), lang)
    }
}

function reRenderPageWithKeyboard(ctx, text, keyboard, state) {
    ctx.user.state = state;
    return ctx.editMessageText(text, keyboard);
}


function makeInlineKeyboard(items, key, actions, lang, cancelTo, backTo, columns) {
    return Extra
        .HTML()
        .markup((m) => {
            let callbackButtons = items.map((item) => {
                let title = item.name ? item.name : JSON.parse(item.description)[lang];
                let data = { ...actions };
                data[key] = item.id;
                let str = dataToStr(data);
                return m.callbackButton(title, str);
            });
            if (backTo) {
                callbackButtons.push(m.callbackButton(`${buttons.back} ${i18n.t(lang, 'button_back')}`, backTo));
            }
            if (cancelTo) {
                callbackButtons.push(m.callbackButton(`${buttons.cancel} ${i18n.t(lang, 'button_cancel')}`, cancelTo));
            }
            return m.inlineKeyboard(callbackButtons, { columns });
        });
}


const dataMap = ['subject', 'previous', 'streetId', 'stopId', 'trolleybusId', 'userId'];

function strToData(str) {
    let splittedStr = str.split(':');
    let result = {};
    for (let i in dataMap) {
        result[dataMap[i]] = splittedStr[i] ? splittedStr[i] : '';
    }

    return result;
}

function dataToStr(data) {
    let result = [];

    if (data.action) {
        result.push(data.action);
    }
    for (let i in dataMap) {
        result.push(dataMap[i] in data ? data[dataMap[i]] : '');
    }
    result = result.join(':');

    return result;
}
