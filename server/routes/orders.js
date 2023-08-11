import express from 'express'
import {
  createOrder,
  getAllOrders,
  getOrderDetail,
  getUserOrders,
  trackOrders,
} from '../controllers/order.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

//post
router.post('/create', verifyToken, createOrder)

//get
router.get('/user', verifyToken, getUserOrders)
router.get('/:id', verifyToken, getOrderDetail)
router.get('/', verifyToken, getAllOrders)

//put
router.put('/:id/tracking', verifyToken, trackOrders)

export default router
