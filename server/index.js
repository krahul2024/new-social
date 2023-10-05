import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { values , connect_database} from './config.js';
import path from 'path';
// routes 
import authRouter from './routes/auth.js'
import userRouter from './routes/user.js'
import uploadRouter from './routes/upload.js'
import postRouter from './routes/post.js'

const file_path = path.resolve()
const app = express();
app.use(cookieParser());

app.use(cors({ origin:true , credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy' , 1) ; 
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(file_path + '/uploads'))

// Route handlers for various routes
app.use('/auth', authRouter); 
app.use('/user', userRouter); 
app.use('/upload', uploadRouter);
app.use('/post', postRouter); 

// Connecting to the MongoDB database
mongoose.set('strictQuery', false);
mongoose.set('strictPopulate', false);
connect_database(); 

app.get('/', (req, res) => {
    res.send('hello bro'); // Route handler for the root endpoint
});

app.listen(values.PORT, () => {
  console.log(`Server is running on port ${values.PORT}`);
});