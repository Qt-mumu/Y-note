const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	user_id: { type: mongoose.SchemaTypes.ObjectId ,ref: 'User'},
	classification: String,
	sortNumber: Number,
	childrenNote:[
		{
			note_id: { type: mongoose.SchemaTypes.ObjectId ,ref: 'Note'},
			noteTitle: String,
			sortNote: Number,
		}
	]
	})

module.exports = mongoose.model('Category', schema)