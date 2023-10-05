import User from '../models/user.js'
import Post from '../models/post.js'
import crypt from 'crypto'
import { connect_database } from '../config.js'

export const getAllPosts = async (req, res) => {
    connect_database(); 

    try {
        const allPosts = await Post.find({}).populate('by');
        if (!allPosts) throw new Error('An error occurred.');

        const sortedPosts = allPosts.sort((a, b) => {
            const epochA = Date.parse(a.createdAt);
            const epochB = Date.parse(b.createdAt);
            return epochB - epochA;
        });

        const formattedPosts = sortedPosts.map((post) => {
            const createdAt = new Date(post.createdAt);
            const formattedDate = `${createdAt.getDate().toString().padStart(2, '0')}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}-${createdAt.getFullYear()}`;
            const formattedTime = `${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}:${createdAt.getSeconds().toString().padStart(2, '0')}`;
            return {
                ...post.toObject(),
                time: `${formattedDate} ${formattedTime}`,
            };
        });

        res.status(200).json({
            success: true,
            posts: formattedPosts,
        });
    } catch (error) {
        console.log({ message: error.message });
        res.status(500).json({
            success: false,
            msg: 'An error occurred.',
        });
    }
};


export const newPost = async (req, res) => {
    connect_database();
    try {
        const { by, caption, photos } = req.body;

        const images = []; 
        for(let i=0;i<photos?.length;i++){
            const {name:{pad, original}, size, type, ext, encoding} = photos[i]; 
            images.push({
                pad, original, size, type, 
                ext, encoding
            })
        }
        console.log('Images from New post creation : ', images); 
        const newPost = new Post({
            by,
            caption,
            photos:images 
        });

        const user = await User.findById(by)
        if (!user) {
            throw new Error('User not found.');
        }

        const postResponse = await newPost.save();
        if (!postResponse) {
            throw new Error('An error occurred while saving the post.');
        }

        user.posts.push(postResponse._id);
        const updatedUser = await user.save();
        if (!updatedUser) {
            throw new Error('An error occurred while saving the user.');
        }
        await updatedUser.populate('posts connections sentRequests receivedRequests')

        return res.status(200).json({
            success: true,
            msg: 'Post created successfully.',
            post: postResponse,
            user: updatedUser
        });
    } catch (error) {
        console.log({ Message: error.message ,error});
        return res.status(500).json({
            success: false,
            msg: 'There was an error while posting.',
        });
    }
};
