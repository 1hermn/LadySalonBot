const { Scenes, Markup } = require('telegraf');
const tools = require('../tools/tools.js')
const fs = require('fs')
const cosm = new Scenes.WizardScene(
    'cosm',
   async (ctx) => {
        tools.log_user_message(ctx)
        ctx.replyWithPhoto({source: fs.createReadStream('img/cosm.jpg')});
        await tools.sleep(1000)
        const inlineMessageKeyboard = Markup.inlineKeyboard([
			Markup.button.url('Показать примеры', 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDYzMDQ2MDcyMDI0MTMx?igshid=4jcwwvd7b061'),
			Markup.button.callback('Специалисты', 'specs'),
            Markup.button.callback('Записаться', 'bill')
		])
        ctx.reply(
`Механическая чистка лица — 58 р.
Уход за чувствительной кожей — 50 р.
Омолаживающий уход — 60 р.
Лифтинг-уход — 45 р.
Уход DermaShine — 50 р.
Экспресс-уход — 40 р.
Всесезонный пилинг — 50 р.
Гликолевый пилинг — 40 р.
Уход Карбокси — 55 р. 
`, inlineMessageKeyboard)
ctx.reply("Для возрата в меню услуг нажмите \"Назад\"", Markup.keyboard([["Назад"]]))
            ctx.session.bills = {}
        ctx.wizard.next();
    },
    async (ctx) => {
        if(ctx.update.callback_query != undefined){
            switch (ctx.update.callback_query.data) {
                case "bill": {
                    ctx.session.bills.serv = "Косметология"
                    return ctx.scene.enter("zapis");
                    break;
                }
                case "specs": {
                    const inlineMessageKeyboard = Markup.inlineKeyboard([
                        Markup.button.callback('Записаться', 'kosm')
                    ])
                    ctx.replyWithPhoto({source: fs.createReadStream('img/lico.jpg')});
                    await tools.sleep(1000)
                    ctx.reply(
`Мария 
Косметолог 5 разряда 
Уходы, атравматические чистки лица, пилинги, массажи, восковые депиляции, ведения клиента, консультация по профессиональному домашнему уходу`, inlineMessageKeyboard)
                    break;
                }
                default:
                    break;
            }
        }else {
            if(ctx.message.text == "Назад"){
                tools.update_scene(ctx, 'services')
                ctx.scene.enter("services")
            }
        }
        return ctx.wizard.next();
    },
    (ctx) => {
        if(ctx.update.callback_query != undefined){
            switch(ctx.update.callback_query.data){
                case "kosm": {
                    ctx.session.bills.serv = "Косметология"
                    return ctx.scene.enter("zapis");
                }
                default:
                    break;
            }
        }else {
            if(ctx.message.text == "Назад"){
                tools.update_scene(ctx, 'zapis')
                return ctx.scene.enter("services")
            }
        }
    }
)
module.exports = {
    scene: cosm
}