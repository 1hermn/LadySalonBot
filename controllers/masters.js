const { Scenes, Markup } = require('telegraf');
const tools = require('../tools/tools.js')
const fs = require('fs')
const masters = new Scenes.WizardScene(
    'masters',
    async (ctx) => {
        tools.log_user_message(ctx)
        ctx.reply("Наши мастера: ", Markup.keyboard([
            ["Мастер бровист и мастер ногтевой сервиса"],
            ["Косметолог"],
            ["Барбер"],
            ["Назад"]
        ]));
        ctx.session.bill = {}
        return ctx.wizard.next();
    },
    async (ctx) => {
        if(ctx.message.text){
            switch(ctx.message.text){
                case "Мастер бровист и мастер ногтевой сервиса": {
                    const inlineMessageKeyboard = Markup.inlineKeyboard([
                        Markup.button.callback('Записаться', 'brov')
                    ])
                    ctx.replyWithPhoto({source: fs.createReadStream('./img/brov.jpg')});
                    await tools.sleep(1000)
                    ctx.reply("Анастасия мастер бровист и мастер ногтевой сервиса")
                    ctx.reply(
`Коррекция и окрашивание бровей. 
Тридинг.
Долговременная укладка бровей.
Окрашивание ресниц.
Комбинированный маникюр+долговременное покрытие.`, inlineMessageKeyboard)

                        break;
                }
                case "Косметолог": {
                    const inlineMessageKeyboard = Markup.inlineKeyboard([
                        Markup.button.callback('Записаться', 'kosm')
                    ])
                    ctx.replyWithPhoto({source: fs.createReadStream('./img/lico.jpg')});
                    await tools.sleep(1000)
                    ctx.reply(
`Мария 
Косметолог 5 разряда 
Уходы, атравматические чистки лица, пилинги, массажи, восковые депиляции, ведения клиента, консультация по профессиональному домашнему уходу`, inlineMessageKeyboard)
                    break;
                }
                case "Барбер": {
                    const inlineMessageKeyboard = Markup.inlineKeyboard([
                        Markup.button.callback('Записаться', 'barb')
                    ])
                    ctx.replyWithPhoto({source: fs.createReadStream('./img/barb.jpg')});
                    await tools.sleep(1000)
                    ctx.reply(
`Миронович Дмитрий 
Барбер 

Мужской мастер,барбер.
Мужские стрижки,укладки,стрижка и коррекция броды
Детские стрижки`, inlineMessageKeyboard)
                    break;
                }
                case "Назад": {
                    tools.update_scene(ctx, 'menu')
                    return ctx.scene.enter("menu")
                }
                default:
                    break;
            }
            const kb  = Markup.keyboard([
                ["Назад"]
            ])
            ctx.reply("Чтобы вернуться, нажмите назад", kb)
            return ctx.wizard.next();
        }else {
            ctx.reply("Ошибка!")
        }
    },
    (ctx) => {
        if(ctx.update.callback_query == undefined){
            if(ctx.message.text == "Назад"){
                tools.update_scene(ctx, 'masters')
                return ctx.scene.enter("masters") 
            }else {
                ctx.reply("Ошибка")
            }
        }else {
            switch(ctx.update.callback_query.data){
                case "brov": {
                    ctx.session.bill.serv = "Макияж и брови"
                    return ctx.scene.enter("zapis")
                }
                case "kosm": {
                    ctx.session.bill.serv = "Косметология"
                    return ctx.scene.enter("zapis")
                }
                case "barb": {
                    ctx.session.bill.serv = "Барбер"
                    return ctx.scene.enter("zapis")
                }
            }
            return ctx.scene.enter("menu")
        }
    }
)
module.exports = {
    scene: masters
}