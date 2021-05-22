const config = require('./config.json')
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const { amoCRMToken } = require('./models/Amo.js')

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

//ТО, что будет выполняться раз в сутки

async function getTokens(){
    let tokens = await amoCRMToken.findOne({id: 0});
    return tokens
}

async function updateTokens(){
    let tokens = await getTokens();
    const body = {
        "client_id": config.amo.client_id,
        "client_secret": config.amo.client_secret,
        "grant_type": "refresh_token",
        "refresh_token": tokens.refresh_token,
        "redirect_uri": config.amo.redirect_uri
    }
    fetch(`${config.amo.domain}/oauth2/access_token`, {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(async json => {
        const tokens = await amoCRMToken.findOne({id: 0});
        tokens.access_token = json.access_token
        tokens.refresh_token = json.refresh_token
        tokens.save(function(err){
            if(err) return console.log(err);
             
            console.log("Токен получен и обновлён", tokens);
            process.exit(-1);
        });
    });
}
updateTokens();