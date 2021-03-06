const { Scenes, Markup } = require('telegraf');
const tools = require('../tools/tools.js')
const fs = require('fs')
const menu = new Scenes.WizardScene(
    'menu',
    (ctx) => {
        tools.log_user_message(ctx)
        ctx.reply('Подскажите мне..', Markup.keyboard([
            ["Популярные услуги 🔝"],
            ["Информация о нас 👋"],
            ["Услуги 👥"],
            ["Наши мастера"], 
            ["Как я могу записаться?  📞"], 
            ["Специалисты и работа"],
            ["Лояльность 👑"],
            ["Онлайн консультация 🙋"],
            //["Избранные услуги ⭐"],
            ["Отзывы 📌"],
            ["Обратная связь 🗣️"]
        ]))
        return ctx.wizard.next();
    },
   async (ctx) => {
        if(!ctx.message){
            console.log("Ошибка")
        }else {
        switch (ctx.message.text) {
            case "Популярные услуги 🔝":
                const PopServices = await tools.get_PopServices();
                for(var i = 0; i < PopServices.length; ++i) {
                    ctx.reply(`${PopServices[i].text}`)
                }
                return ctx.scene.enter("masters")
                break;
            case "Информация о нас 👋":{
                ctx.replyWithMediaGroup([
                    {
                        type: 'photo',
                        media: {
                            source: fs.createReadStream('img/about_us_1.jpg')
                        }   
                    },
                    {
                        type: 'photo',
                        media: {
                            source: fs.createReadStream('img/about_us_2.png')
                        }  
                    }
                ])
                await tools.sleep(1000)
                ctx.replyWithMarkdown(`*Салон красоты Lady D.I. Studio* — творческое бьюти-пространство для создания привлекательных и неповторимых образов.

Благодаря душевной атмосфере, заботливым рукам специалистов и профессиональной косметике lux-сегмента,
можно забыть о суетливых буднях и окунуться в волну расслабления и нескончаемого удовольствия.

Адрес: [улица Подгорная 67 пом 1а, Минск](https://yandex.by/maps/157/minsk/?ll=27.680517%2C53.953493&mode=whatshere&whatshere%5Bpoint%5D=27.680490%2C53.953487&whatshere%5Bzoom%5D=17&z=17)
Время работы: 
понедельник   09:00–20:00
вторник           09:00–20:00
среда.   	09:00–20:00
четверг	09:00–20:00
пятница	09:00–20:00
суббота	09:00–17:00
воскресенье	09:00–17:00                
`)
//ОТПРАВИТЬ ФОТО
                break;
            }
            case "Наши мастера": {
                tools.update_scene(ctx, 'masters')
                return ctx.scene.enter("masters")
            }
            case "Как я могу записаться?  📞" :{
                tools.update_scene(ctx,'zapis')
                ctx.scene.enter("zapis")
                break;
                //TODO: запись календарь
            }
            case "Специалисты и работа": {
                const inlineMessageKeyboard = Markup.inlineKeyboard([
                    Markup.button.url('Перети', 'https://www.instagram.com/lady.d.i/')
                ])
                ctx.reply("Специалисты и работа:", inlineMessageKeyboard)
                break;
            }
            case "Лояльность 👑" : {
                ctx.reply(`В салоне Lady D.I. вы и можете получить кэшбек 10% на все ваши услуги при оплате картой RRB CUB или предъявлении приложения CashUBack. 
			Для этого Вы может бесплатно зарегистрироваться на платформе CashUBack.by и экономить на своих покупках до 40%`)
                break;
            }
            case "Онлайн консультация 🙋" : {
                ctx.replyWithMarkdown("[+375 29 111 22 58](tel:+375 29 111 22 58)");
                break;
            }
            case "Избранные услуги ⭐": {
                const ExcServices = await tools.get_excServices();
                for(var i = 0; i < ExcServices.length; ++i) {
                    ctx.reply(`${ExcServices[i].text}`)
                }
                break;
            }
            case "Отзывы 📌": {
                const inlineMessageKeyboard = Markup.inlineKeyboard([
                    Markup.button.url('Посмотреть', 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDI3MzM4MjM2MTU2MzAz?igshid=u4ci9t2rghu9')
                ])
                ctx.reply("Отзывы:", inlineMessageKeyboard)
                break;
            }
            case "Обратная связь 🗣️": {
                tools.update_scene(ctx, 'otziv')
                ctx.scene.enter("otziv")
                break;
            }
            case 'Услуги 👥':{
                tools.update_scene(ctx, 'services')
                ctx.scene.enter("services");
            }
            default:
                break;
        }
    }
    }
)
module.exports = {
    scene: menu
}
