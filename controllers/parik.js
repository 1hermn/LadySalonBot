const { Scenes, Markup } = require('telegraf');
const {sleep, update_scene, log_user_message} = require('../tools/tools.js')
const fs = require('fs')
const parik = new Scenes.WizardScene(
    'parik',
    async (ctx) => {
        log_user_message(ctx)
        ctx.replyWithPhoto({source: fs.createReadStream('img/parik.jpg')});
        await sleep(1000)
        ctx.reply("Выберите пункт..", Markup.keyboard([
            ["Стрижка"],
            ["Окрашивание"],
            ["Причёски"],
            ["Уход за волосами"],
            ['Назад']
        ]))
        ctx.session.bills = {}
        return ctx.wizard.next();
    },
    (ctx) => {
        if(ctx.update.callback_query != undefined){
            ctx.reply("Ошибка");
            return ctx.wizard.back();
        }
        switch (ctx.message.text) {
            case "Стрижка":{
                ctx.session.bills.serv = "Стрижка"
                ctx.reply(
`Стрижка женская модельная короткая / средняя / длинная — 34 р. / 39 р. / 42 р.
Стрижка женская одним срезом — 15 р.
Стрижка челки — 8 р.
Стрижка женская горячими ножницами / короткая / средняя / длинная — 38 р. / 43 р. / 48 р.
`)
                break;
            }
            case "Окрашивание": {
                ctx.session.bills.serv = "Окрашивание"
                ctx.reply(
`Окрашивание корней — 34 / 38 / 42 р.
Окрашивание волос — 39 /43 / 48 р.
Тонирование волос — 20 / 23 / 25 р.
Мелирование волос — 44 / 50 / 60 р.
Частичное мелирование — 22 / 25 / 30 р.
Сложное окрашивание (Ombre, калифорнийское мелирование, airtouch, шатуш) — 70 / 80 / 90 р.
`)
                break;
            }
            case "Причёски":{
                ctx.session.bills.serv = "Причёски"
                ctx.reply(
`Укладка повседневная — 19 / 22 / 25 р.
Торжественная укладка, локоны — 25 / 30 / 35 р.
Вечерняя прическа — 30 / 40 / 50 р.
Плетение — 10 / 15 / 20 р.
`)
                break;
            }
            case "Уход за волосами":{
                ctx.session.bills.serv = "Уход за волосами"
                ctx.reply(
`Ламинирование волос Paul Mitchell (без препаратов) — 60 / 70 / 75 р.
Spa-уход для волос (мытьё с маской под тип волос без сушки) — 28 / 33 / 38 р.
`)
                break;
            }
            case "Назад": {
                update_scene(ctx, 'services')
                return ctx.scene.enter("services")
             }
            default:
                break;
        }
        ctx.reply("Для возрата в меню услуг нажмите \"Назад\"", Markup.keyboard([["Назад"]]))
        const inlineMessageKeyboard = Markup.inlineKeyboard([
			Markup.button.url('Показать примеры', 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDU5Mjc1MDA2MDM4NDAy?igshid=nu1bhlny87g9'),
            Markup.button.callback('Записаться', 'bill')
		])
        ctx.reply("Больше информации?", inlineMessageKeyboard)
        ctx.wizard.next();
    },
    (ctx) => {
        if(ctx.update.callback_query != undefined){
            switch (ctx.update.callback_query.data) {
                case "bill": {
                    ctx.scene.enter("zapis")
                    break;
                }
                case "specs": {
                    break;
                }
                default:
                    break;
            }
        }else {
            if(ctx.message.text == "Назад"){
                update_scene(ctx, 'parik')
                ctx.scene.enter("parik")
            }
        }
    }
)
module.exports = {
    scene: parik
}