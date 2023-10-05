import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    by:{
        type:Schema.Types.ObjectId, 
        ref:'User'
    },
    title: String,
    caption: String,
    photos: [{
        pad:String, 
        original:String, 
        size : Number,
        encoding:String,
        ext:String, 
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps : true})

export default model('Post', postSchema);