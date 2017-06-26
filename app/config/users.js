const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	id: String,
    token: String,
    email: String,
    name: String,
    username: String,
});

const FbModel = mongoose.model('user',userSchema);

module.exports = FbModel;


