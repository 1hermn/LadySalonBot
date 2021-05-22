const { Scenes, Markup } = require('telegraf');
const {sleep, update_scene, log_user_message} = require('../tools/tools.js')
const fs = require('fs')
const mass = new Scenes.WizardScene(
    'mass',
   async (ctx) => {
        log_user_message(ctx)
        ctx.replyWithPhoto({source: fs.createReadStream('img/mass.jpg')});
        await sleep(1000)
        ctx.reply('Выберите пункт', Markup.keyboard([
            ["Массаж"],
            ["Обертывание и коктейли для тела"],
            ["SPA-программа"],
            ["Депиляция"],
            ["Назад"]
        ]))
        ctx.wizard.next();
    },
    (ctx) => {
        if(ctx.update.callback_query != undefined){
            ctx.reply("Ошибка");
            return ctx.wizard.back();
        }
        ctx.session.bill = {}
        switch (ctx.message.text) {
            case "Массаж":{
                ctx.session.bills.serv = "Массаж"
                ctx.reply(
`
Массаж шейно-воротниковой зоны и головы — 25 р.
Массаж спины (30 минут) — 25 р.
Массаж спины (60 минут) — 45 р.
Классический массаж (для женщин) — 35 р.
Классический массаж (для мужчин) — 40 р.
Антицеллюлитный массаж — 40 р.
Лимфодренажный массаж — 35 р.
Аромамассаж - релакс массаж — 50 р.
Испанский массаж — 50 р.
Массаж солевыми мешочками — 55 р.
Грейпфрутовый скраб-массаж — 60 р
Пилинг массаж "Райское наслаждение" — 75 р.
Массаж горячими камнями "Stone massage" — 75 р.
Детский массаж (30 минут) — 25 р.
Хиромассаж тела — 60 р.
Массаж Raindrop Technique - Young Living — 70 р.
`)
                break
            }
            case "Обертывание и коктейли для тела": {
                ctx.session.bills.serv = "Обертывание и коктейли для тела"
                ctx.reply(
`
Обертывание с морскими водорослями — 70 р.
Обертывание «Шоколадный рай» — 70 р.
Обертывание «Наслаждение золотом» — 70 р.
Обертывание "Клюквенный фреш". — 70 р.
Коктейль для тела «Мохито» (обертывание Имбирь, массаж) — 100 р.
Коктейль для тела «Капучино» (обертывание массаж) — 100 р.
Коктейль для тела "Клюквенный фреш" (обертывание массаж) — 100 р.
Коктейль для тела «Брызги шампанского» (обертывание массаж) — 100 р.
Полироль для тела — 35 р.
`
                    )
                    break
            }
            case "SPA-программа":{
                ctx.session.bills.serv = "SPA-программа"
                ctx.reply(
`
SPA-программа «Таинственный океан» (обертывание и уход по лицу) — 105 р.
SPA-программа «Красотка в шоколаде» (обертывание, массаж лица, маникюр) —140 р.
SPA-программа «Цитрусовое наслаждение» (скраб массаж и маникюр) — 90 р.
SPA ритуал «Снятие стресса» — 65 р.
SPA ритуал «Блаженство через стопы» — 60 р
Программа «Антистресс» (массаж тела и массаж лица) — 85 р.
Комплекс «Spa-день в салоне Lady D. I. (массаж, уход, маникюр, педикюр) — 180 р.
Программа « Стройный силуэт» (массаж 30 мин и обертывание) — 100 р.
`
                    )
                    break;
            }
            case "Депиляция":{
                ctx.session.bills.serv = "Депиляция"
                ctx.reply(
`Депиляция голени — 18 р.
Депиляция бедер 19 р.
Депиляция ног (голень, бедро) р.
Депиляция рук — 16 р.
Депиляция бикини классическое — 28 р.
Депиляция бикини глубокое — 35 р.
Депиляция подмышек — 15 р.
Депиляция подбородка — 6 р.
Депиляция над верхней губой — 8 р.`)
                break;
            }
            case "Назад":
                update_scene(ctx, 'services')
                return ctx.scene.enter("services")
            default:
                break;
        }
        ctx.reply("Для возрата в меню услуг нажмите \"Назад\"", Markup.keyboard([["Назад"]]))
        const inlineMessageKeyboard = Markup.inlineKeyboard([
			Markup.button.url('Показать примеры', 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDU5Mjc1MDA2MDM4NDAy?igshid=nu1bhlny87g9'),
            Markup.button.url('Массаж наглядно', 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODU3Nzg4MDEzMzkwNjQw?igshid=1hzr7r858udhz'),
			Markup.button.callback('Специалисты', 'specs'),
            Markup.button.callback('Записаться', 'bill')
		])
        ctx.reply("Больше информации?", inlineMessageKeyboard)
        return ctx.wizard.next();
    },
   async (ctx) => {
       
        if(ctx.update.callback_query != undefined){
            const inlineMessageKeyboard = Markup.inlineKeyboard([
                Markup.button.callback('Записаться', 'kosm')
            ])
            switch (ctx.update.callback_query.data) {
                case "bill": {
                    return ctx.scene.enter("zapis");
                    break;
                }
                case "specs": {
                    ctx.replyWithPhoto({source: fs.createReadStream('img/lico.jpg')});
                    await sleep(1000)
                    ctx.reply(
`Мария 
Косметолог 5 разряда 
Уходы, атравматические чистки лица, пилинги, массажи, восковые депиляции, ведения клиента, консультация по профессиональному домашнему уходу`)
                    break;
                }
                default:
                    break;
            }
        }else {
            if(ctx.message.text == "Назад"){
                update_scene(ctx, 'mass')
                ctx.scene.enter("mass")
            }
        }
        return ctx.wizard.next();
    },
    (ctx) => {
        if(ctx.update.callback_query != undefined){
            switch(ctx.update.callback_query.data){
                case "kosm": {
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
    scene: mass
}