import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    by:{
        type:Schema.Types.ObjectId, 
        ref:'User'
    },
    title: String,
    caption: String,
    photos: [{
        type:String
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    tags:[{
        type:Schema.Types.ObjectId, 
        ref:'User'
    }], 
    likes: [],
}, {timestamps : true})

export default model('Post', postSchema);