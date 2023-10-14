import {Schema, model} from 'mongoose'; 

const CommentSchema = new Schema({
	by:{
		type:Schema.Types.ObjectId, 
		ref:'User'
	}, 
	photos:[], 
	caption:String, 
	videos:[], 
	tags:[], 
	likes:[],
	comments:[{
		type:Schema.Types.ObjectId, 
		ref:'Comment'
	}], 
}, {timestamps : true}); 

export default model('Comment', CommentSchema); 