const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {
    addAdmin
    } = require('../tools/tools.js');
const add_admin = new Scenes.WizardScene(
    'add_admin',
    async (ctx) => {
        ctx.reply("Перешлите сообщение пользователя, которому вы хотите дать права администратора", Markup.keyboard([
            ["Назад"]
        ]))
        ctx.wizard.next()
    },
	(ctx) => {
		if(ctx.message){
			if(ctx.message.forward_from){
                console.log(ctx.message.forward_from)
                if(ctx.message.forward_from.is_bot){
                    ctx.reply("Ошибка, этот пользователь - бот")
                }
                ctx.reply(`Добавляю пользователя с id ${ctx.message.forward_from.id}`);
                addAdmin(ctx.message.forward_from)
                ctx.scene.enter("director")
            }else {
                if(ctx.message.text == "Назад"){
                    return ctx.scene.enter("director")
                }
                ctx.reply("Вы не переслали сообщение")
            }
		}
	}
)
module.exports = {
    scene: add_admin
}