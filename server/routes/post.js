import Router from 'express'; 
import {auth} from '../middlewares/auth.js'
import {
	newPost, 
	newComment, 
	getAllPosts, 
	getPostById, 
	deletePost, 
	deleteComment, 
	likePost, 
	savePost, 
} from '../controllers/post.js'

const router = Router(); 


// postId, userId
router.post('/save', auth, savePost); 

// postId, userId
router.post('/like', auth, likePost); 

// commentId
router.post('/deleteComment', auth, deleteComment); 

// postId 
router.post('/deletePost', auth, deletePost); 

// postId
router.post('/get', getPostById); 

// nothing
router.get('/all', getAllPosts); 

// by, caption, photos, postId
router.post('/newComment', auth, newComment); 

// by, caption, photos
router.post('/newPost', auth, newPost); 

export default router; 