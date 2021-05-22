const { Scenes } = require('telegraf');
const {update_scene, log_user_message, get_user, add_user} = require('../tools/tools.js')
const scene =  new Scenes.WizardScene(
    'get_name',
    async (ctx) => {
        log_user_message(ctx)
        let userInfo = await get_user(ctx)
        if(userInfo){
            ctx.session.user = {}
                ctx.session.user.name = userInfo.name;
                ctx.session.user.phone = userInfo.phone;
                ctx.session.user.id = userInfo.id
            ctx.reply(`Добро пожаловать, ${userInfo.name}`)
            return ctx.scene.enter('menu');
        }
        ctx.reply('Здравствуйте, подскажите, как я могу к Вам обращаться?', {reply_markup: {remove_keyboard: true}});
        ctx.session.user = {};
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.session.user.phone = 0;
        ctx.session.user.name = ctx.message.text
        add_user(ctx, ctx.session.user.name, ctx.session.user.phone)
        ctx.reply(`Очень приятно, ${ctx.session.user.name}, Я бот Инесса. Чем я могу помочь?`)
        update_scene(ctx, 'menu')
        return ctx.scene.enter("menu");
    }
)
module.exports = {
    scene
}