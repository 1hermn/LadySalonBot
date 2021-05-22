const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const amoCRMTokenScheme = new Schema({
    access_token: String,
    refresh_token: String,
    id: Number
});

const amoCRMToken = mongoose.model("Amo", amoCRMTokenScheme);
module.exports = {
    amoCRMToken: amoCRMToken
}