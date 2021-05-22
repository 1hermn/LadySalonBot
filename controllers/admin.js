const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {get_user, count_users} = require('../tools/tools.js');
const admin = new Scenes.WizardScene(
	'admin',
	async (ctx) => {
		let userInfo = await get_user(ctx)
		if(userInfo){
			ctx.session.user = {}
			ctx.session.user.name = userInfo.name;
			ctx.session.user.phone = userInfo.phone;
			ctx.session.user.id = userInfo.id
			ctx.reply(`Добро пожаловать в админ- меню, ${userInfo.name}`)
		}
		let count = await count_users();
		ctx.session.user.count = count;
		const admin_crontrol = Markup.keyboard([
			["Посмотреть статистику бота"],
            ["Просмотреть сообщения пользователей"],
			//["Изменить избранные услуги"],
			["Изменить популярные услуги"],
			[`Сделать рассылку для ${ctx.session.user.count} пользователей`],
			["Выход"]
		])
		ctx.reply("Что вы хотите сделать?", admin_crontrol);
		return ctx.wizard.next();
	},
	(ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Посмотреть статистику бота": {
					ctx.reply("Количество пользователей у бота:\nСтатистика в реальном времени:")
					ctx.reply("https://analytics.google.com/analytics/web/template?uid=bCEhLlgLQGmBIg_IQXK2RQ")
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
)
module.exports = {
    scene: admin
}
