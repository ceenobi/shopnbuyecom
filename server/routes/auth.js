import express from 'express'
import {
  createResetSession,
  generateOTP,
  getUser,
  loginUser,
  registerUser,
  resetPassword,
  updateUser,
  verifyOTP,
} from '../controllers/auth.js'
import { verifyToken, localVariables } from '../middlewares/auth.js'
import { registerMail } from '../controllers/mail.js'

const router = express.Router()

// post
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/registerMail', registerMail)

//get
router.get('/user-profile/:username', verifyToken, getUser)
router.get('/user/:username', getUser)
router.get('/generate-otp', localVariables, generateOTP)
router.get('/verify-otp', verifyOTP)
router.get('/createResetSession', createResetSession)

//update
router.put('/updateuser', verifyToken, updateUser)
router.put('/reset-password', resetPassword)

export default router
