import express from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.js';
import { upload } from '../helpers/multer.js';
import { deleteUser, getAllUsers, getOneUser, updateUser } from '../controllers/user.js';


const router = express.Router();

// routes
router.post('/register', upload.single('image'), register)
router.post('/login', login)
router.get('/user', getAllUsers)
router.get('/user/:userId', getOneUser)
router.put('/user/:userId', login, upload.single('image'), updateUser)
router.get('/user/:userId', deleteUser)


// forgot password and reset password
router.post("/forgotPassword", forgotPassword)
router.post("/reset-password", resetPassword)


export default router