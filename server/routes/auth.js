import {Router} from 'express'; 
import {
	register, 
	login, 
	logout
} from '../controllers/auth.js'; 

const router = Router(); 

router.get('/', async(req,res) => {
	return res.status(200).send({
		success:true, 
		msg:'Successful.'
	})
})

router.post('/login', login); 

router.post('/register', register); 


export default router; 