const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {get_excServices, checkPermForAdmin, checkPermForDirector} = require('../tools/tools.js');
const exc_serv_menu = new Scenes.WizardScene(
	'exc_serv_menu',
	async (ctx) => {
        //вывести акции
		const admin_crontrol = Markup.keyboard([
			["Удалить избранную услугу"],
			["Добавить избранную услугу"],
            ["Посмотреть избранные услуги"],
            ["Назад"]
		])
		ctx.reply("Что вы хотите сделать?", admin_crontrol);
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Добавить избранную услугу": {
                    return ctx.scene.enter('add_exc_serv')
				}
				case "Удалить избранную услугу": {
					return ctx.scene.enter('del_exc_serv')
				}
                case "Посмотреть избранные услуги": {
                    const excServices = await get_excServices();
                    ctx.reply("Избранные услуги, которые есть в базе")
                    for(var i = 0; i < excServices.length; ++i) {
                        ctx.reply(`${excServices[i].id}.${excServices[i].text}`)
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
    scene: exc_serv_menu
}