const { Scenes, Markup } = require('telegraf');
const {update_scene, log_user_message} = require('../tools/tools.js');
const services = new Scenes.WizardScene(
    'services',
    (ctx) => {
        log_user_message(ctx)
        ctx.reply('Выберите пункт..', Markup.keyboard([
            ["Косметология и услуги для лица🧏"],
            ["Массаж и услуги для тела 🛀"],
            ["Ногтевой сервис 💅"],
            ["Парикмахерские услуги"],
            ["Услуги барбера"],
            ["Макияж и брови 👄"],
            ["Назад"]
        ]))
        return ctx.wizard.next();
    },
    (ctx) => {
        if(ctx.update.callback_query != undefined){
            ctx.reply("Ошибка");
            return ctx.wizard.back();
        }
        switch (ctx.message.text) {
            case "Косметология и услуги для лица🧏":
                update_scene(ctx, 'cosm')
                return ctx.scene.enter("cosm");
            case "Массаж и услуги для тела 🛀":
                update_scene(ctx, 'mass')
                return ctx.scene.enter("mass");
            case"Ногтевой сервис 💅":
                update_scene(ctx, 'ns')
                return ctx.scene.enter("ns");
            case 'Парикмахерские услуги':
                update_scene(ctx, 'parik')
                return ctx.scene.enter("parik")
            case "Услуги барбера":
                update_scene(ctx, 'barber')
                return ctx.scene.enter("barber")
            case "Макияж и брови 👄":
                update_scene(ctx, 'mak')
                return ctx.scene.enter("mak")
            case "Назад":
                update_scene(ctx, 'menu')
                return ctx.scene.enter("menu");
            default:
                break;
        }
    }
)
module.exports = {
    scene: services
}
