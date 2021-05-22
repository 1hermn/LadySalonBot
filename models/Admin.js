const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminScheme = new Schema({
    name: String,
    id: Number,
    isDirector: Boolean,
    stats: {
        mails: Number,
        answers: Number,
        exc_services: Number,
	    pop_services: Number,
    }
});

const Admin = mongoose.model("Admin", adminScheme);
module.exports = {
    Admin: Admin
}