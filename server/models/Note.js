const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	user_id: { type: mongoose.SchemaTypes.ObjectId ,ref: 'User'},
	classification_id: { type: mongoose.SchemaTypes.ObjectId ,ref: 'Category'},
	title: String,
	noteText: String,
	createTime: {
		type: Date,	
	},
})

module.exports = mongoose.model('Note', schema)

