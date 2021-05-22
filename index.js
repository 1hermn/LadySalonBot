const { Telegraf, Markup, Scenes, session } = require('telegraf');
const fs = require('fs')
const config = require('./config.json')
const {get_user, log_user_message, get_user_scene, checkPermForAdmin, checkPermForDirector} = require('./tools/tools.js')

//Изменить прайс
//Решить чё со сделками

const bot = new Telegraf(config.token);
var stage_array = [];

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://Admin:GLeB201520@176.57.208.24:27017/ladis?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', err => {
  console.log('error', err)
})
db.once('open', () => {
  console.log('Подключено к базе данных')
})

//загрузка сцен
files = fs.readdirSync("./controllers/")
files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const { scene } = require(`./controllers/${file}`)
    let methoddName = file.split(".")[0];
    console.log("Сцена", methoddName, " загружена")
    stage_array.push(scene)
});
const stage = new Scenes.Stage(stage_array)

stage.command('admin', async ctx => {
	let count = await checkPermForAdmin(ctx.message.from.id)
	if(count >= 1){
		let count_d = await checkPermForDirector(ctx.message.from.id)
		if(count_d >= 1){
			ctx.scene.enter('director')		
		}else {
			ctx.scene.enter('admin')
		}
	}else {
		ctx.reply("Неизвестная команда!")
	}
})

bot.use(session());
bot.use(stage.middleware())

bot.on("message", Telegraf.optional(
	async (ctx) => {
		let scene = await get_user_scene(ctx)
		if(scene && scene != 'null' && ctx.message.text != "/admin"){
			let user_info = await get_user(ctx)
			if(user_info){
				ctx.session.user = {}
				ctx.session.user.name = user_info.name;
				ctx.session.user.phone = user_info.phone;
				ctx.session.user.id = user_info.id	
			}else {
				ctx.reply("/start")
			}
			ctx.reply("Бот возобновляет свою работу. Нажмите на кнопку ещё раз")
			return ctx.scene.enter(scene)
		}else {
			ctx.reply("/start")
		}
	}
))

bot.start(async (ctx) => {
	let user_info = await get_user(ctx)
	if(user_info){
		ctx.session.user = {}
		ctx.session.user.name = user_info.name;
		ctx.session.user.phone = user_info.phone;
		ctx.session.user.id = user_info.id	
	}
	let scene = await get_user_scene(ctx)
	if(!scene || scene == 'null'){
		return ctx.scene.enter('get_name');
	}
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))