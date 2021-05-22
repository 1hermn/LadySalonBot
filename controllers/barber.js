const { Scenes, Markup } = require('telegraf');
const {sleep, update_scene, log_user_message} = require('../tools/tools.js')
const fs = require('fs')
const barber = new Scenes.WizardScene(
    'barber',
    async (ctx) => {
        log_user_message(ctx)
        ctx.replyWithPhoto({source: fs.createReadStream('img/barber.jpg')});
        await sleep(1000)
            ctx.reply(
`Стрижка мужская — 30 р.
Оформление бороды — 30 р.
Комплекс: стрижка+борода — 55 р.
Стрижка детская до 12 лет — 20 р.
Стрижка модельная Мужская — 28/30 р.
Стрижка мужская машинкой — 18 р.
Мужская укладка 10 р. волос феном с мытьем Камуфлирование седины для мужчин (без препаратов) — 23 р.
Стрижка детская (до 5 лет) — 10/13/15 р
Стрижка детская (от 5 до 12 лет) — 14/16/18 р
`)
        ctx.reply("Для возрата в меню услуг нажмите \"Назад\"", Markup.keyboard([["Назад"]]))
        const inlineMessageKeyboard = Markup.inlineKeyboard([
			Markup.button.url('Показать примеры', 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODkzOTU5NjUyMzA5NTM0?igshid=l5b74fuj9cbt'),
			Markup.button.callback('Специалисты', 'specs'),
            Markup.button.callback('Записаться', 'bill')
		])
        ctx.session.bills = {}
        ctx.reply("Больше информации?", inlineMessageKeyboard)
        ctx.wizard.next();
    },
   async (ctx) => {
        if(ctx.update.callback_query != undefined){
            switch (ctx.update.callback_query.data) {
                case "bill": {
                    ctx.session.bills.serv = "Барбер"
                    return ctx.scene.enter("zapis");
                    break;
                }
                case "specs": {
                    const inlineMessageKeyboard = Markup.inlineKeyboard([
                        Markup.button.callback('Записаться', 'barb')
                    ])
                    ctx.replyWithPhoto({source: fs.createReadStream('img/barb.jpg')});
                    await sleep(1000)
                    ctx.reply(
`Миронович Дмитрий 
Барбер 

Мужской мастер,барбер.
Мужские стрижки,укладки,стрижка и коррекция броды
Детские стрижки`, inlineMessageKeyboard) 
                    break;
                }
                default:
                    break;
            }
        }else {
            if(ctx.message.text == "Назад"){
                update_scene(ctx, 'services')
                ctx.scene.enter("services")
            }
        }
        return ctx.wizard.next();
    },
    (ctx) => {
        if(ctx.update.callback_query != undefined){
            switch(ctx.update.callback_query.data){
                case "barb": {
                    ctx.session.bills.serv = "Барбер"
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
    scene: barber
}