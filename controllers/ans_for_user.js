const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {checkPermForAdmin, checkPermForDirector, mail_for_user} = require('../tools/tools.js');
const ans_for_user = new Scenes.WizardScene(
	'ans_for_user',
	async (ctx) => {
		const admin_crontrol = Markup.keyboard([
            ["Назад"]
		])
		ctx.reply("Отправьте номер вопроса пользователя", admin_crontrol);
		return ctx.wizard.next();
	},
    (ctx) => {
        if(ctx.message){
            ctx.session.user.ans = ctx.message.text
            ctx.reply("Теперь отправьте сообщение пользователю");
            return ctx.wizard.next();
        }
    },
	async (ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Назад": {
			        let count = await checkPermForAdmin(ctx.message.from.id)
                    if(count >= 1){
                        let count_d = await checkPermForDirector(ctx.message.from.id)
                        if(count_d >= 1){
                            return ctx.scene.enter('director')		
                        }else {
                            return ctx.scene.enter('admin')
                        }
                    }
				}
				default:
					break;
			}
            ctx.session.user.action_text = ctx.message.text;
            ctx.reply(`Вы ввели:\n${ctx.session.user.action_text}\nОтправить пользователю?`, Markup.keyboard([
                ["Да"],
                ["Нет"]
            ]))
            return ctx.wizard.next();
		}
	},
    async (ctx) => {
        if(ctx.message) {
            switch (ctx.message.text) {
                case "Да":
                    ctx.reply("Отправляю..")
                    mail_for_user(ctx, ctx.session.user.ans, ctx.session.user.action_text)
                    break;
                case "Нет":
                    ctx.reply("Отменяю")
                    break;
                default:
                    break;
            }
            let count = await checkPermForAdmin(ctx.message.from.id)
            if(count >= 1){
                let count_d = await checkPermForDirector(ctx.message.from.id)
                if(count_d >= 1){
                    return ctx.scene.enter('director')		
                }else {
                    return ctx.scene.enter('admin')
                }
            }
        }
    }
)
module.exports = {
    scene: ans_for_user
}