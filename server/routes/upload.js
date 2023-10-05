import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {values, connect_database} from '../config.js'

const router = Router();

// setting up multer 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});


const upload = multer({
    storage
});


function hash(value) {
    const hash_value = crypto.createHash('sha256');
    hash_value.update(value);
    return hash_value.digest('hex').substring(0, 32);
}

function createFile(file) {
    const { originalname, mimetype, size, encoding } = file; 
    const names = originalname.split('.'), type = mimetype; 
    const ext = names[names.length - 1], time = Date.now().toString(), pad = hash(time); 
    return {
    	name:{
    		pad, original : originalname, 
    	}, 
    	size, type, ext, encoding
    }
}

router.post('/images', upload.array('files'), async(req,res) => {
	connect_database(); 
	const images = []; 
	console.log({files:req.files})
	for(let i=0;i<req.files.length;i++){
		let oldPath = req.files[i].path; 
		const {name:{pad, original}, size, type, ext, encoding} = createFile(req.files[i]); 
		const newPath = `uploads/${pad}${original}`
		console.log({newPath})
		fs.renameSync(oldPath, newPath); 
		images.push(createFile(req.files[i])); 
	}
	return res.status(200).send({
		success:true, 
		msg:'Successfully uploaded the images.', 
		images
	});
});


export default router; 