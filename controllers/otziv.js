const { Scenes } = require('telegraf');
const {update_scene, log_user_message, add_message} = require('../tools/tools.js');
const otziv = new Scenes.WizardScene(
    'otziv',
    (ctx) => {
        log_user_message(ctx)
        ctx.reply("Введите текст сообщение")
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply("Сообщение отправлено! Спасибо за обратную связь!");
        add_message(ctx, ctx.message.text)
        update_scene(ctx, 'menu')
        return ctx.scene.enter("menu");
    }
)
module.exports = {
    scene: otziv
}