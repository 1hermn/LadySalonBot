const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {get_user, count_users, checkPermForDirector, get_admins} = require('../tools/tools.js');
const director = new Scenes.WizardScene(
    'director',
    async (ctx) => {
        let userInfo = await get_user(ctx)
		if(userInfo){
			ctx.session.user = {}
			ctx.session.user.name = userInfo.name;
			ctx.session.user.phone = userInfo.phone;
			ctx.session.user.id = userInfo.id
			ctx.reply(`Добро пожаловать в меню директора, ${userInfo.name}`)
		}
		let count = await count_users();
		ctx.session.user.count = count;
		const admin_crontrol = Markup.keyboard([
			["Посмотреть статистику бота"],
            ["Посмотреть статистику администраторов"],
            ["Просмотреть сообщения пользователей"],
			//["Изменить избранные услуги"],
			["Изменить популярные услуги"],
			[`Сделать рассылку для ${ctx.session.user.count} пользователей`],
            ["Добавить администратора"],
			["Выход"]
		])
		ctx.reply("Что вы хотите сделать?", admin_crontrol);
		return ctx.wizard.next();
    },
    async (ctx) => {
        var count = await checkPermForDirector(ctx.message.from.id)
        if(count >= 1){
            if(ctx.message){
                switch (ctx.message.text) {
                    case "Посмотреть статистику бота": {
                        ctx.reply("Количество пользователей у бота:\nСтатистика в реальном времени:")
                        ctx.reply("https://analytics.google.com/analytics/web/template?uid=bCEhLlgLQGmBIg_IQXK2RQ")
                        break;
                    }
                    case "Добавить администратора": {
                        return ctx.scene.enter("add_admin")
                    }
                    case "Посмотреть статистику администраторов": {
                        var admins = await get_admins();
                        ctx.reply("Получаю статистику...")
                        for(var i = 0; i < admins.length; i++) {
                            ctx.reply(`Админ: ${admins[i].name}\nСтатистика отправленных(добавленных):\n Рассылки: ${admins[i].stats.mails}\n Ответы пользователям: ${admins[i].stats.answers}\n Поп.услуги: ${admins[i].stats.pop_services}\n Изб.услуги: ${admins[i].stats.exc_services}`)
                        }
                        break;
                    }
                    case `Сделать рассылку для ${ctx.session.user.count} пользователей`: {
                        return ctx.scene.enter("mails")
                    }
                    case "Изменить избранные услуги": {
                        return ctx.scene.enter('exc_serv_menu')
                    }
                    case "Изменить популярные услуги": {
                        return ctx.scene.enter('pop_serv_menu')
                    }
                    case "Просмотреть сообщения пользователей": {
                        return ctx.scene.enter('message_for_user')
                    }
                    case "Выход": {
                        return ctx.scene.enter('get_name');
                    }
                    default:
                        break;
                }
            }
        }
    }
)
module.exports = {
    scene: director
}
