import Router from 'express'; 
import {auth} from '../middlewares/auth.js'

import {
	getUser,
} from '../controllers/user.js'; 

const router = Router(); 


router.get('/profile', auth, getUser); 


export default router; 