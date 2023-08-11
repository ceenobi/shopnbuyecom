import express from 'express'
import Product from '../models/product.js'
import data from '../sampledata.js'
import {
  getProductsByNewOrPreorder,
  getProductsByFeatured,
  getAllProducts,
  getProductsByCat,
  getOneProduct,
  searchProducts,
  likeProduct,
  dislikeProduct,
  getUserLikedProduct,
  deleteProduct,
  createNewProduct,
} from '../controllers/product.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

//send products to db
router.post('/send', async (req, res) => {
  await Product.deleteMany({})
  const products = await Product.insertMany(data.products)
  res.send({ products })
})

//get
router.get('/params', getProductsByNewOrPreorder)
router.get('/featured', getProductsByFeatured)
router.get('/', getAllProducts)
router.get('/:catId', getProductsByCat)
router.get('/name/:slug', getOneProduct)
router.get('/search/product', searchProducts)
router.get('/userliked/:username', verifyToken, getUserLikedProduct)

//put
router.put('/:productId/like', verifyToken, likeProduct)
router.put('/:productId/dislike', verifyToken, dislikeProduct)

//delete
router.delete('/:id', verifyToken, deleteProduct)
//create
router.post('/', verifyToken, createNewProduct)

export default router
