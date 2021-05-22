const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const popServiceScheme = new Schema({
    text: String,
    id: Number,
   
});

const PopService = mongoose.model("PopService", popServiceScheme);
module.exports = {
    PopService: PopService
}