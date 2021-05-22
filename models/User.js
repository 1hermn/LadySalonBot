const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema({
    name: String,
    phone: String,
    id: Number,
    admin: Boolean,
    scene: String,
    contact_id: Number,
});

const User = mongoose.model("User", userScheme);
module.exports = {
    User: User
}