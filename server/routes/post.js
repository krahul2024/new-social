import Router from 'express'; 
import {auth} from '../middlewares/auth.js'
import {
	newPost, 
	getAllPosts, 
} from '../controllers/post.js'

const router = Router(); 


router.get('/all', getAllPosts); 


router.post('/new', auth, newPost); 


export default router; 