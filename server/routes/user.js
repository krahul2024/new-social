import Router from 'express'; 
import {auth} from '../middlewares/auth.js'

import {
	getUser,
	getUserById, 
	updateProfile,
} from '../controllers/user.js'; 

const router = Router(); 


router.get('/profile', auth, getUser); 


router.post('/update', auth, updateProfile); 

router.get('/:userId', getUserById); 


export default router; 