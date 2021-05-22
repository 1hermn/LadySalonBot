const { Scenes, Markup } = require('telegraf');
const {sleep, update_scene, log_user_message} = require('../tools/tools.js')
const fs = require('fs')
const ns = new Scenes.WizardScene(
    'ns',
    async(ctx) => {
        log_user_message(ctx)
        ctx.replyWithPhoto({source: fs.createReadStream('img/ns.jpg')});
        await sleep(1000)
        ctx.reply("Выберите пункт..", Markup.keyboard([
            ["Маникюр"],
            ["Spa-маникюр и покрытие"],
            ["маникюр + покрытие"],
            ["Педикюр"],
            ["Педикюр + покрытие"],
            ["Назад"]
        ]))
        ctx.session.bills = {}
        ctx.wizard.next();
    },
    (ctx) => {
        if(ctx.update.callback_query != undefined){
            ctx.reply("Ошибка");
            return ctx.wizard.back();
        }
        switch (ctx.message.text) {
            case "Маникюр": {
                ctx.session.bills.serv = "Маникюр"
                ctx.reply(
`Классический или европейский маникюр — 17 р
Комбинированный/ аппаратный маникюр. — 20 р.
Мужской маникюр — 20 р
`)              
                break;
            }
            case "Spa-маникюр и покрытие": {
                ctx.session.bills.serv = "Spa-маникюр и покрытие"
                ctx.reply(
`Spa-маникюр без покрытия — 29 р.
Покрытие ногтей лаком. — 7 р.
Покрытие ногтей лаком "френч" — 9 р.
Долговременное покрытие гель-лаком — 25 р.
Долговременное "френч" покрытие гель-лаком — 28 р.
Снятие долговременного покрытия — 8 р.
`
)
                break;
            }
            case "маникюр + покрытие": {
                ctx.session.bills.serv = "маникюр + покрытие"
                ctx.reply(
`Маникюр+ долговременное покрытие гель-лаком (однотонное) —38 р.
Маникюр+ долговременное покрытие гель-лаком "френч" — 41 р.
Аппаратный маникюр+ долговременное покрытие гель-лаком — 42 Кнопка Spa-маникюр и покрытие:
Spa-маникюр без покрытия — 29 р.
Покрытие ногтей лаком. — 7 р.
Покрытие ногтей лаком "френч" — 9 р.
Долговременное покрытие гель-лаком — 25 р.
Долговременное "френч" покрытие гель-лаком — 28 р.
Снятие долговременного покрытия — 8 р.
`)
                break;
            }
            case "Педикюр": {
                ctx.session.bills.serv = "Педикюр"
                ctx.reply(
`Классический педикюр — 33 р.
Комбинированный/ аппаратный педикюр — 35/38 р
Мужской педикюр — 35 р.
Spa-педикюр без покрытия — 40 р.`
                )
                break;
            }
            case 'Педикюр + покрытие': {
                ctx.session.bills.serv = "Педикюр + покрытие"
                ctx.reply(
`Педикюр+ долговременное покрытие гель-лаком однотонное — 50 р.
Педикюр+ долговременное покрытие гель-лаком "френч" — 53 р.
Аппаратный педикюр+ долговременное покрытие тельствием — 55 р.
`
                )
                break;
            }
            case "Назад":{
                update_scene(ctx, 'services')
                return ctx.scene.enter("services")
            }
            default:
                break;
        }
        ctx.reply("Для возрата в меню услуг нажмите \"Назад\"", Markup.keyboard([["Назад"]]))
        const inlineMessageKeyboard = Markup.inlineKeyboard([
			Markup.button.url('Показать примеры', 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDQyMjg0OTc0MTE4MTY1?igshid=171xiqianezp6'),
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
                    break;
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
                update_scene(ctx, 'ns')
                ctx.scene.enter("ns")
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
    scene: ns
}