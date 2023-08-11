import express from 'express'
import data from './sampledata.js'
import Category from './models/category.js'
import Product from './models/product.js'

const router = express.Router()

router.post('/', async (req, res) => {
  await Product.deleteMany({})
  const importProducts = await Product.insertMany(data.products)
  res.send({ importProducts })
})
router.post('/send', async (req, res) => {
  await Category.deleteMany({})
  const importCategories = await Category.insertMany(data.categories)
  res.send({ importCategories })
})

export default router
