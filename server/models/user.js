import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    name: String,
    location: String,
    phone: String,
    email: String,
    username: String,
    password: String,
    profileImage: String,
    coverImage: String,
    connections: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    birthDate: Date,
    bio: String,
    sentRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    recvRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }], 
    savedPosts:[{
        type:Schema.Types.ObjectId, 
        ref:'Post'
    }],
    blocked:[{
        type:Schema.Types.ObjectId, 
        ref:'User'
    }], 
    // settings:{}
}, { timestamps: true });

export default model('User', userSchema);