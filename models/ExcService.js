const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const excServiceScheme = new Schema({
    text: String,
    id: Number,
   
});

const excService = mongoose.model("excService", excServiceScheme);
module.exports = {
    excService: excService
}