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

// delete-conn-req
// show-sentReqs, showRecvReqs

export const showConnections = async(req,res) => {
    try{
        const {userId} = req.body; 
        const user = await User.findById(userId)
            .populate({
                path:'connections',
                populate:[{
                    path:'connections'
                }]
            }); 
        if(!user) return res.status(500).json({
            msg:'There was an error fetching connections'
        })

        return res.status(200).json({
            connections:user.connections
        }); 
    }
    catch(error){
        console.log({message:error.message, error}); 
        return res.status(500).json({
            msg:'Error retrieving connections!'
        })
    }
}

export const showSuggestions = async(req,res) => {
    try{
        const id = req.id; 

        const [user, allUsers] = await Promise.all([
            User.findById(id), 
            User.find()
        ]); 
        if(!user || !allUsers) return res.status(500).json({
            msg:'User not found'
        }); 

        const toAvoid = [...user.connections, ...user.sentRequests, ...user.recvRequests].map(String);  
        const suggestions = allUsers.filter((userItem) => toAvoid.includes(userItem._id.toString())); 

        return res.status(200).json({
            suggestions:suggestions.slice(0,5), 
        }); 
    }
    catch(error){
        console.log({message:error.message, error}); 
        return res.status(500).json({
            msg:'An error occured during fetching suggestions'
        })
    }
}

export const deleteConnection = async(req,res) => {
    connect_database(); 

    try {
        const {toUserId, fromUserId} = req.body; 
        const [toUser, fromUser] = await Promise.all([
            User.findById(toUserId), 
            User.findById(fromUserId)
        ]); 

        if(!toUser || !fromUser) return res.status(500).json({
            msg:'Could not find the user'
        })

        const toUserConns = toUser.connections.filter((id) => id.toString() !== fromUserId); 
        const fromUserConns = fromUser.connections.filter((id) => id.toString() !== toUserId); 

        await Promise.all([toUser.save(), fromUser.save() ]); 
        await fromUser.populate('connections sentRequests recvRequests posts'); 

        return res.status(200).json({
            user:fromUser
        })
        
    } catch (error) {
        console.log({ message:error.message, error });
        return res.status(500).send({
            success: false,
            msg: 'An error occurred while deleting the connection request',
        });
    }
}

export const rejectConnectionReq = async(req,res) => {
    connect_database(); 

    try {
        const {toUserId, fromUserId} = req.body; 
        const [toUser, fromUser] = await Promise.all([
            User.findById(toUserId), 
            User.findById(fromUserId)
        ]); 

        if(!toUser || !fromUser) return res.status(500).json({
            msg:'Could not find the user'
        })

        const recvReqs = toUser.recvRequests.filter((id) => id.toString() !== fromUserId); 
        const sentReqs = fromUser.sentRequests.filter((id) => id.toString() !== toUserId); 

        toUser.recvRequests = recvReqs;
        fromUser.sentRequests = sentReqs; 

        await Promise.all([toUser.save(), fromUser.save() ]); 
        await toUser.populate('connections sentRequests recvRequests posts'); 

        return res.status(200).json({
            user:toUser
        })
        
    } catch (error) {
        console.log({ message:error.message, error });
        return res.status(500).send({
            success: false,
            msg: 'An error occurred while rejecting the connection request',
        });
    }
}

export const acceptConnectionReq = async(req,res) => {
    connect_database(); 

    try {
        const {toUserId, fromUserId} = req.body; 
        const [toUser, fromUser] = await Promise.all([
            User.findById(toUserId), 
            User.findById(fromUserId)
        ]); 

        if(!toUser || !fromUser) return res.status(500).json({
            msg:'Could not find the user'
        })

        const recvReqs = toUser.recvRequests.filter((id) => id.toString() !== fromUserId); 
        const sentReqs = fromUser.sentRequests.filter((id) => id.toString() !== toUserId); 

        toUser.recvRequests = recvReqs;
        fromUser.sentRequests = sentReqs; 

        // adding to the connections list
        toUser.connections.push(fromUserId); 
        fromUser.connections.push(toUserId); 

        await Promise.all([toUser.save(), fromUser.save() ]); 
        await toUser.populate('connections sentRequests recvRequests posts'); 

        return res.status(200).json({
            user:toUser
        })
        
    } catch (error) {
        console.log({ message:error.message, error });
        return res.status(500).send({
            success: false,
            msg: 'An error occurred while accepting the connection request',
        });
    }
}


export const sendConnectionReq = async(req,res) => {
    connect_database(); 

    try {
        const {toUserId, fromUserId} = req.body; 
        const [toUser, fromUser] = await Promise.all([
            User.findById(toUserId), 
            User.findById(fromUserId)
        ]); 

        if(!toUser || !fromUser) return res.status(500).json({
            msg:'Could not find the user'
        })

        fromUser.sentRequests.push(toUser._id); 
        toUser.recvRequests.push(fromUser._id); 

        await Promise.all([
            toUser.save(), 
            fromUser.save()
        ]); 

        await fromUser.populate('posts connections sentRequests recvRequests'); 

        return res.status(200).json({
            user:fromUser
        })

    } catch (error) {
        console.log({ message:error.message, error });
        return res.status(500).send({
            success: false,
            msg: 'An error occurred while sending the connection request',
        });
    }
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
            .populate('posts connections comments sentRequests recvRequests'); 

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
            .populate('posts connections comments')

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


