const { Scenes, Markup } = require('telegraf');
const {update_scene, log_user_message, bill, updateUser} = require('../tools/tools.js');
const months = {
	"Январь": 1,
	"Февраль": 2,
	"Март" : 3,
	"Апрель" : 4,
	"Май": 5,
	"Июнь": 6,
	"Июль": 7,
	"Август": 8,
	"Сентябрь": 9,
	"Октябрь": 10,
	"Ноябрь": 11,
	"Декабрь": 12
}
const days = [
	"01","02","03","04","05","06","07","08",
	"09","10","11","12","13","14","15","16",
	"17","18","19","20","21","22","23","24",
	"25","26","27","28","29","30","31"
	]
const hours = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]
const hours_json = {
	"12:00": 12,
	"13:00": 13,
	"14:00": 14,
	"15:00": 15,
	"16:00": 16,
	"17:00": 17,
	"18:00": 18,
	"19:00": 19,
	"20:00": 20,
	"21:00": 21,
	"22:00": 22
}
const date = new Date()
const month = date.getMonth()
const day = date.getDate()
const hour = date.getHours()
const zapis = new Scenes.WizardScene(
    'zapis',
    (ctx) => {
        ctx.reply('Оставьте, пожалуйста, контактный номер телефона, по которому мы сможем с Вами связаться',
        {
        "reply_markup": {
            "resize_keyboard": true,
            "keyboard": [
            [
                {
                "text": "Отправить номер телефона",
                "request_contact": true
                },
            ]
            ]
        }
        }
        )
        return ctx.wizard.next();
    },
    async (ctx) => {
        log_user_message(ctx)
        ctx.session.user.phone = ctx.message.contact.phone_number
        await updateUser(ctx, ctx.session.user.name, ctx.session.user.phone)
        ctx.reply(`Ваш номер телефона: ${ctx.session.user.phone}. Записаться?`,Markup.keyboard([
            ["Да"],
            ["Нет"]
        ]));
        return ctx.wizard.next();
    },
    (ctx) => {
        switch (ctx.message.text) {
            case "Да":{
				ctx.reply("Получаю информацию с сервера...")
				var arrays = []
				for(var i = month + 1, k = 0; i <= 12; i++){
					for(var mon in months){
						if(months[mon] == i){
							var a = [];
							a.push(mon)
							arrays.push(a)
						}
					}
				}
				var a = [];
				a.push("Отмена")
				arrays.push(a)
				const month_keyboard = Markup.keyboard(arrays).resize()
				//получить текущий месяц цифрой
				ctx.reply(`${ctx.session.user.name}, на какой месяц вы бы хотели записаться?`, month_keyboard);
				return ctx.wizard.next();           
            }
            case "Нет":
                ctx.reply("Запись отменена")
                break;
            default:
                break;
        }
        update_scene(ctx, 'menu')
        return ctx.scene.enter("menu")
    },
	(ctx) => {
		if(!ctx.message || ctx.message.text == "Отмена"){
			ctx.reply("Отменяю запись");
			update_scene(ctx, 'menu')
			return ctx.scene.enter('menu'); 
		}
		if(months[ctx.message.text] < month){
			ctx.reply("Невозможно отправить месяц, может быть он уже прошёл?")
		}else {
			ctx.session.bills.month = months[ctx.message.text]
			
			var day_arr = []
			var a = [];
			if(month + 1 == ctx.session.bills.month){
				for(var i = day - 1, k = 1; i < days.length; i++, k++){
					a.push(days[i])
					if(k % 8 == 0 || i == days.length - 1 ){
						day_arr.push(a);
						a = []
					}
				}
			}else {
				for(var i = 0, k = 1; i < days.length; i++, k++){
					a.push(days[i])
					if(k % 8 == 0 || i == days.length - 1 ){
						day_arr.push(a);
						a = []
					}
				}
			}
			var a = ["Отмена"]
			day_arr.push(a)
			
			const day_keywboard = Markup.keyboard(day_arr).resize()
			
			ctx.reply("Хорошо, теперь выберите день", day_keywboard)
			return ctx.wizard.next();
		}
	},
	(ctx) => {
		if(!ctx.message || ctx.message.text == "Отмена"){
			ctx.reply("Отменяю запись");
			update_scene(ctx, 'menu')
			return ctx.scene.enter('menu'); 
		}
		ctx.session.bills.day = days[ctx.message.text - 1]

		var hours_arr = [];
		if(month + 1 == ctx.session.bills.month && day == ctx.session.bills.day){
			h = (hour < 12) ? 0 : (hour - 11);
			for(var i = h; i < hours.length && i >= 0; i++){
				let a = [];
				a.push(hours[i])
				hours_arr.push(a);
			}
		}else {
			for(var i = 0; i < hours.length; i++){
				let a = [];
				a.push(hours[i])
				hours_arr.push(a);
			}
		}
		hours_arr.push(["Отмена"])
		const time_keboard = Markup.keyboard(hours_arr).resize()
		ctx.reply("И наконец, выберите время", time_keboard)
		return ctx.wizard.next();
	},
	(ctx) => {
		if(!ctx.message || ctx.message.text == "Отмена"){
			ctx.reply("Отменяю запись");
			update_scene(ctx, 'menu')
			return ctx.scene.enter('menu'); 
		}
		ctx.session.bills.time = hours_json[ctx.message.text]
		//отправить в CRM
		ctx.reply(`${ctx.session.user.name}, вы успешно Записались:\nМесяц: ${ctx.session.bills.month}\nДень:${ctx.session.bills.day}\nВремя:${ctx.session.bills.time}\nТелефон:${ctx.session.user.phone}`)
		bill(ctx)
		
		update_scene(ctx, 'menu')
		return ctx.scene.enter('menu');
	}
)
module.exports = {
    scene: zapis
}
