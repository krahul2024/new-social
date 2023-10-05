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

// Getting user information
export const getUser = async (req, res) => {
    connect_database(); 
    try {
        const { id } = req; // Extracting the 'id' from the request body
        const user = await User.findOne({ _id: id })
            .populate('posts')

        res.status(200).send({
            success: true,
            user
        });
    } catch (error) {
        console.log({message:error.message, error}); // Logging the error message
        res.status(500).send({
            success: false,
            error: error.message
        });
    }
};


