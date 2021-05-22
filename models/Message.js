const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageScheme = new Schema({
    message: String,
    user_id: Number,
    id: Number,
});

const Message = mongoose.model("Message", messageScheme);
module.exports = {
    Message: Message
}