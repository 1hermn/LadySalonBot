const { Scenes, Markup } = require('telegraf');
const tools = require('../tools/tools.js')
const fs = require('fs')
const bill = new Scenes.WizardScene(
    'bill',
    (ctx) => {
        tools.log_user_message(ctx)
    }
)
module.exports = {
    scene: bill
}