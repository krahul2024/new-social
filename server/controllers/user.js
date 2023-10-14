import mongoose from 'mongoose'
import User from '../models/user.js'
import Post from '../models/post.js'
import crypt from 'crypto'
import {connect_database } from '../config.js'

const get_hash = (text) => {
    const hash = crypt.createHash('sha512')
    hash.update(text)
    return hash.digest('hex')
}


export const updateProfile = async (req, res) => {
    connect_database(); 

    try {
        const { user } = req.body;
        let existingUser = await User.findById(user._id);

        if (!existingUser) {
            throw new Error('No such user exists');
        }

        existingUser.set(user); // Use set() to update the user object
        existingUser = await existingUser.save();

        if (!existingUser) {
            throw new Error('There was a problem updating the user details.');
        }

        await existingUser.populate('posts connections sentRequests recvRequests');
        return res.status(200).send({
            success: true,
            msg: 'User details updated successfully.',
            user: existingUser,
        });

    } catch (error) {
        console.log({ message:error.message, error });
        return res.status(500).send({
            success: false,
            msg: 'An error occurred while updating the user details.',
        });
    }
};



export const getUserById = async(req,res) => {
    connect_database(); 
    const id = req.params.userId;
    const err = 'There was a problem getting user information.'; 

    try{
        const user = await User.findById(id)
            .populate('posts'); 

        console.log({user})
        if(!user) throw new Error(err); 
        return res.status(200).json({
            success:true, 
            msg:'Successfully fetched user infomation.', 
            user 
        })
    }
    catch(error){
        console.log({message:error.message, error}); 
        return res.status(500).json({
            success:false, 
            msg:err 
        })
    }
}


// Getting user information
export const getUser = async (req, res) => {
    connect_database(); 
    try {
        const { id } = req; // Extracting the 'id' from the request body
        const user = await User.findOne({ _id: id })
            .populate('posts')

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log({message:error.message, error}); // Logging the error message
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


