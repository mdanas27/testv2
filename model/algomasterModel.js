const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
	
	AlgorithmId:{
		
		type:Number,
		required:true
		
	},
	
	AlgorithmName:{
		
		type:String,
		required:true
		
		
	}
	
	
	
});

const Contact = module.exports = mongoose.model('contactinfo',ContactSchema,'AlgorithmMaster');