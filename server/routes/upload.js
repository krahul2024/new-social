import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path, {dirname, extname, join} from 'path';
import crypto from 'crypto';
import {fileURLToPath } from 'url'; 
import {values, connect_database} from '../config.js'
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'

const router = Router();
const filePath = path.resolve(); 

// setting up multer 
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const originalname = file.originalname;
//     const extension = originalname.split('.').pop(); // Get the file extension
//     const timestamp = Date.now();
//     const newFilename = `${originalname.replace(/\.[^/.]+$/, '')}_${timestamp}.${extension}`;
//     cb(null, newFilename);
//   },
// });


const upload = multer({ dest: '/tmp' });
const bucket = 'rahul-social-bucket' , region = 'ap-south-1'

const uploadToS3 = async(path, originalFilename, mimetype , filename) => {
    connect_database(); 
    // client which can be used to upload files to s3 
    const client = new S3Client({
        region,
        credentials:{
            accessKeyId:values.aws_access_key,
            secretAccessKey:values.aws_secret_access_key,
        }
    })
    const data = await client.send( new PutObjectCommand({
        Bucket:bucket,
        Body:fs.readFileSync(path),
        Key:filename,
        ContentType:mimetype,
        ACL:'public-read',
    }))
    return `https://${bucket}.s3.amazonaws.com/${filename}`
}


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
		let {name:{pad, original}, size, type, ext, encoding} = createFile(req.files[i]); 
		pad += `_${i}_`; 
		const newPath = `${pad}${original}`
		console.log({newPath})
		// fs.renameSync(oldPath, newPath); 
		const finalPath = await uploadToS3(oldPath, original, type, newPath); 
		images.push(finalPath); 
	}
	console.log({images})
	return res.status(200).json({
		success:true, 
		msg:'Successfully uploaded the images.', 
		images
	});
});


export default router; 