import { model, Schema } from 'mongoose';

const groupSchema = new Schema({
    name: String,
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        },
        by: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }, 
        time : Date,
    }],
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true }); 

export default model('Group', groupSchema); 