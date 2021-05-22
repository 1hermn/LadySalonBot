const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {get_Messages, checkPermForAdmin, checkPermForDirector} = require('../tools/tools.js');
const message_for_user = new Scenes.WizardScene(
	'message_for_user',
	async (ctx) => {
        //вывести акции
		const admin_crontrol = Markup.keyboard([
			["Посмотреть сообщения пользователей"],
			["Ответить пользователю"],
            ["Назад"]
		])
		ctx.reply("Что вы хотите сделать?", admin_crontrol);
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Ответить пользователю": {
					return ctx.scene.enter("ans_for_user")
				}
                case "Посмотреть сообщения пользователей": {
                    const messages = await get_Messages();
                    ctx.reply("Избранные услуги, которые есть в базе")
                    for(var i = 0; i < messages.length; ++i) {
                        ctx.reply(`${messages[i].id}.${messages[i].message}`)
                    }
                    break;
                }
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
		}
	}
)
module.exports = {
    scene: message_for_user
}