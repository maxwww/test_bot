const models = require('../models');

module.exports = function (opts) {
    opts = Object.assign({
        property: 'user',
        getUserInfo: (ctx) => {
            return {
                userId: ctx.from && ctx.from.id,
                is_bot: ctx.from && ctx.from.is_bot,
                first_name: ctx.from && ctx.from.first_name,
                last_name: ctx.from && ctx.from.last_name,
                username: ctx.from && ctx.from.username,
                language_code: ctx.from && ctx.from.language_code
            }
        }
    }, opts)


    return async (ctx, next) => {
        const userInfo = opts.getUserInfo(ctx)
        const { userId } = userInfo;
        delete userInfo.userId;

        if (!userId) {
            return next(ctx)
        }
        let user = await models.User.findById(userId);
        if (!user) {
            user = await models.User.create({
                id: userId,
                ...userInfo,
                selected_language_code: userInfo.language_code.substring(0,2),
            })
        } else if (!isIdentical(userInfo, user)) {
            await user.update({
                ...userInfo,
            });
        }
        Object.defineProperty(ctx, opts.property, {
            get: function () {
                return user
            },
            set: function (newUser) {
                user = Object.assign({}, newUser)
            }
        })

        userInfo.selected_language_code = user.selected_language_code;

        await next(ctx);

        if (!isIdentical(userInfo, user)) {
            await user.save();
        }

        return;

    }
}

const isIdentical = (obj1, obj2) => {
    let result = true;

    for (let property in obj1) {
        if (!(property in obj2) || obj1[property] !== obj2[property]) {
            result = false;
            break;
        }
    }

    return result;
}
