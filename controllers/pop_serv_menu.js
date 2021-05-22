const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const {get_PopServices, checkPermForAdmin, checkPermForDirector} = require('../tools/tools.js');
const pop_serv_menu = new Scenes.WizardScene(
	'pop_serv_menu',
	async (ctx) => {
        //вывести акции
		const admin_crontrol = Markup.keyboard([
			["Удалить популярную услугу"],
			["Добавить популярную услугу"],
            ["Посмотреть популярные услуги"],
            ["Назад"]
		])
		ctx.reply("Что вы хотите сделать?", admin_crontrol);
		return ctx.wizard.next();
	},
	async (ctx) => {
		if(ctx.message){
			switch(ctx.message.text){
				case "Добавить популярную услугу": {
                    return ctx.scene.enter('add_pop_serv')
				}
				case "Удалить популярную услугу": {
					return ctx.scene.enter('del_pop_serv')
				}
                case "Посмотреть популярные услуги": {
                    const PopServices = await get_PopServices();
                    ctx.reply("Популярные услуги, которые есть в базе")
                    for(var i = 0; i < PopServices.length; ++i) {
                        ctx.reply(`${PopServices[i].id}.${PopServices[i].text}`)
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
    scene: pop_serv_menu
}