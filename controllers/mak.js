const { Scenes, Markup } = require('telegraf');
const {sleep, update_scene, log_user_message} = require('../tools/tools.js')
const fs = require('fs')
const mak = new Scenes.WizardScene(
    'mak',
    async (ctx) => {
        log_user_message(ctx)
        ctx.replyWithPhoto({source: fs.createReadStream('img/mak.jpg')});
        await sleep(1000)
        ctx.reply("Выберите пункт..", Markup.keyboard([
            ["Макияж и локоны"],
            ["Брови"],
            ["Назад"]
        ]))
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.session.bills = {}
        if(ctx.update.callback_query != undefined){
            ctx.reply("Ошибка");
            return ctx.wizard.back();
        }
        switch (ctx.message.text) {
            case "Макияж и локоны":{
                ctx.session.bills.serv = "Макияж и локоны"
                ctx.reply(
`Экспресс-макияж — 30 р.
Дневной макияж — 40 р.
Вечерний макияж — 60/80 р.
Локоны — 30 р
`)
                break;
            }
            case "Брови": {
                ctx.session.bills.serv = "Брови"
                ctx.reply(
`Моделирование и коррекция бровей (пинцет, нить) — 15 р.
Окрашивание бровей —15 р.
Комплекс: моделирование + окрашивание бровей — 30 р.
Окрашивание ресниц — 15 р.
Биофиксация бровей — 20 р.
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
			Markup.button.url('Показать примеры', 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODU3Nzg4MDEzMzkwNjQw?igshid=1hzr7r858udhz'),
			Markup.button.callback('Специалисты', 'specs'),
            Markup.button.callback('Записаться', 'bill')
		])
        ctx.reply("Больше информации?", inlineMessageKeyboard)
        ctx.wizard.next();
    },
    async (ctx) => {
        if(ctx.update.callback_query != undefined){
            const inlineMessageKeyboard = Markup.inlineKeyboard([
                    Markup.button.callback('Записаться', 'brov')
                ])
            switch (ctx.update.callback_query.data) {
                
                case "bill": {
                    return ctx.scene.enter("zapis");
                }
                case "specs": {
                    ctx.replyWithPhoto({source: fs.createReadStream('img/brov.jpg')});
                    await sleep(1000)
                    ctx.reply("Анастасия мастер бровист и мастер ногтевой сервиса")
                    ctx.reply(
`Коррекция и окрашивание бровей. 
Тридинг.
Долговременная укладка бровей.
Окрашивание ресниц.
Комбинированный маникюр+долговременное покрытие.`, inlineMessageKeyboard)
                    break;
                }
                default:
                    break;
            }
        }else {
            if(ctx.message.text == "Назад"){
                update_scene(ctx, services)
                ctx.scene.enter("services")
            }
        }
        return ctx.wizard.next();
    },
    (ctx) => {
        if(ctx.update.callback_query != undefined){
            switch(ctx.update.callback_query.data){
                case "brov": {
                    return ctx.scene.enter("zapis");
                }
                default:
                    break;
            }
        }else {
            if(ctx.message.text == "Назад"){
                update_scene(ctx, 'services')
                return ctx.scene.enter("services")
            }
        }
    }
)
module.exports = {
    scene: mak
}