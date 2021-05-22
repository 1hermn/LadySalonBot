const config = require('../config.json')
const { User } = require('../models/User.js')
const { Message } = require('../models/Message.js')
const { Admin } = require('../models/Admin.js')
const { excService } = require('../models/ExcService.js')
const { PopService } = require('../models/PopService.js')
const { amoCRMToken } = require('../models/Amo.js')
const fetch = require('node-fetch');
var ua = require('universal-analytics');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkPermForAdmin(id){	
	let json = await Admin.findOne({id: id}).countDocuments()
	return json;
}

async function checkPermForDirector(id){
	let json = await Admin.findOne({id: id, isDirector: true}).countDocuments()
	return json;
}
async function amo_request(url, method, body){
	const access_token = await getToken();
	var res = await fetch(`${config.amo.domain}${url}`, {
        method: method,
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + access_token
	 	},
    })
	var json = await res.json()
	return json
}
const userscenes = {
	"barber": "Просмотр услуг барбера",
	"bill" : "Запись",
	"cosm" : "Просмотр косметологических услуг",
	"mak"  : "Просмотр услуг макияжа",
	"mass" : "Просмотр услуг массажа",
	"masters" : "Просмтр масстеров",
	"menu": "Переход в меню",
	"ns" : "Просмотру услуг ноктевого сервесиса",
	"otziv" : "Оставлено сообщение",
	"parik" : "Просмотр парикмахерских услуг",
	"services" : "Просмотр всех услуг",
	"get_name" : "Пользователь начал диалог с ботом",
	"zapis": "Запись"
}

function log_user_message(ctx){
	if(ctx.message) {
		var visitor = ua(config.gaid, ctx.message.from.id, {strictCidFormat: false});
		visitor.pageview("/"+userscenes[ctx.session.__scenes.current]).send()
	}
}

async function mailing(ctx, text){
	let json = await User.find();
	ctx.reply("Отправляю...")
	json.forEach(usr => {
		try{
			ctx.tg.sendMessage(usr.id, `${text}`)
		}catch(err){
			ctx.reply(`Ошибка при отправке пользователю\nTELEGRAM ID:${usr.id}\nИмя:${usr.name}`)
		}
	})
	updateMails(ctx.message.from.id)
	ctx.reply("Рассылка завершена")
}
async function mail_for_user(ctx,id, text){
	var message = await Message.find({id: id})
	console.log(message)
	ctx.reply("Отправляю...")
	ctx.tg.sendMessage(message[0].user_id, `${text}`)
	Message.find({id: id}).remove().exec()
	updateAnswers(ctx.message.from.id)
	ctx.reply("Сообщение отправлено")
}
async function add_message(ctx, message){
	console.log(message)
	const messages = await Message.find();
	var id = 0;
	for(var i = 0; i < messages.length; i++){
		if(messages[i].id > id){
			id = messages[i].id;
		}
	}
	id++
	const msg = new Message({
		message: message,
		id: id,
		user_id: ctx.message.from.id
	})
	msg.save();
}
async function getToken(){
    let tokens = await amoCRMToken.findOne({id: 0});
    return tokens.access_token
}
async function add_user(ctx, name, phone){
	const user = new User({
		name: name,
		phone: phone,
		id: ctx.message.from.id,
		admin: false,	
		scene: 'null'
	})
	user.save(function(err){
		if(err) return console.log(err);
		 
		console.log("Новый пользователь сохранён,", user);
	});
}
async function updateUser(ctx, name, phone){
	var user = await User.findOne({id: ctx.message.from.id})
	if(user.phone == phone){
		return
	}
	user.phone = phone
	user.save()
	const body = [
		{
			"first_name": user.name,
			"custom_fields_values": [
				{
					"field_id": 643969,
					"values": [
						{
							"value": phone
						}
					]
				},
				{
					"field_id": 702819,
					"values": [
						{
							"value": "Бот Lady"
						}
					]
				}
			]
		}
	]
	const json = await amo_request('/api/v4/contacts', 'POST', body)
	console.log(json)
	const id = json._embedded.contacts[0].id
	var usr = await get_user(ctx)
	usr.contact_id = id
	usr.save()
	console.log("Новый пользователь добавлнен в CRM, id контакта в базе обновлён")
}
async function bill(ctx){
	const usr = await get_user(ctx)
	const contact_id = usr.contact_id
//ctx.reply(`${ctx.session.user.name}, вы успешно Записалиьс:\nМесяц: ${ctx.session.bills.month}\nДень:${ctx.session.bills.day}\nВремя:${ctx.session.bills.time}\nТелефон:${ctx.session.user.phone}`)
	if(ctx.session.bills.serv == undefined){
		ctx.session.bills.serv = "Отсуствует"
	}
	const body = [
		{
			"name": `Запись. Услуга: ${ctx.session.bills.serv}.Месяц: ${ctx.session.bills.month}.День:${ctx.session.bills.day}.Время:${ctx.session.bills.time}`,
			"created_by": 7068022,
			"_embedded": {
				"contacts": [
					{
						"id" : contact_id
					}
				]
			}
		}
	]
	var json = await amo_request('/api/v4/leads', 'POST', body)
	const id = json._embedded.leads[0].id
	new_task(ctx, id)
}
async function new_task(ctx, lead_id){
	const cur = new Date()
	const date = new Date(cur.getFullYear(),ctx.session.bills.month - 1,ctx.session.bills.day, ctx.session.bills.time)
	const milliseconds = date.getTime()/1000;
	const body = [
		{
			"task_type_id": 1,
			"text": `Запись на услугу:${ctx.session.bills.serv} | Салон`,
			"complete_till": milliseconds,
			"entity_id": lead_id,
			"entity_type": "leads"
		}
	]
	const json = await amo_request('/api/v4/tasks', 'POST', body)
	console.log(json)
}
async function addExtService(ctx, text){
	const excServices = await excService.find();
	var id = 0;
	for(var i = 0; i < excServices.length; i++){
		if(excServices[i].id > id){
			id = excServices[i].id;
		}
	}
	id++
	const _excService = new excService({
		text: text,
		id: id
	})
	updateExc(ctx.message.from.id)
	_excService.save();
}
async function addPopService(ctx,text){
	const PopServices = await PopService.find();
	var id = 0;
	for(var i = 0; i < PopServices.length; i++){
		if(PopServices[i].id > id){
			id = PopServices[i].id;
		}
	}
	id++
	const _PopService = new PopService({
		text: text,
		id: id
	})
	updatePop(ctx.message.from.id)
	_PopService.save();
}
function addAdmin(forward){
	const admin = new Admin({
		name: forward.first_name,
		id: forward.id,
		isDirector: false,
		stats: {
			mails: 0,
			answers: 0,
			exc_services: 0,
	    	pop_services: 0,
		}
	})
	admin.save();
}

async function updateMails(id){
	let json = await Admin.findOne({id: id})
	json.stats.mails = json.stats.mails + 1;
	json.save();
}
async function updateAnswers(id){
	let json = await Admin.findOne({id: id})
	json.stats.answers = json.stats.answers + 1;
	json.save();
}
async function updatePop(id){
	let json = await Admin.findOne({id: id})
	json.stats.pop_services = json.stats.pop_services + 1;
	json.save();
}
async function updateExc(id){
	let json = await Admin.findOne({id: id})
	json.stats.exc_services = json.stats.exc_services + 1;
	json.save();
}

async function delete_PopService(id){
	PopService.find({id : Number(id)}).remove().exec()
}
async function delete_excService(id){
	excService.find({id : Number(id)}).remove().exec()
}

async function get_PopServices(){
	const PopServices = await PopService.find();
	return PopServices
}
async function get_Messages(){
	const Messages = await Message.find();
	return Messages
}
async function get_excServices(){
	const excServices = await excService.find();
	return excServices
}
async function get_admins(){	
	let json = await Admin.find();
	return json;
}

async function get_user_scene(ctx){
	let usr = await get_user(ctx)
	if(usr) {
		return usr.scene
	}
}

async function update_scene(ctx, name){
	let usr = await get_user(ctx)
	if(usr) {
		usr.scene = name;
		usr.save();
	}
}

async function count_users(){
	var count = await User.find().countDocuments();
	return count
}

async function get_user(ctx){
	let json = await User.findOne({id: ctx.message.from.id})
	return json
}

module.exports = {
	log_user_message,
    sleep: sleep,
	add_user,
	addAdmin,
	addExtService,
	get_user_scene,
	update_scene,
	get_user,
	get_admins,
	get_excServices,
	get_PopServices,
	add_message,
	checkPermForAdmin,
	checkPermForDirector,
	count_users,
	delete_excService,
	delete_PopService,
	addPopService,
	get_Messages,
	mailing,
	mail_for_user,
	bill,
	updateUser
}
