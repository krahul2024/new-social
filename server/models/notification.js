import { model, Schema } from 'mongoose';

const notificationSchema = new Schema({
    message: String,
    person: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
}, { timestamps: true }); 

export default model('Notification', notificationSchema); 