import express from 'express'
import { getProductCategory } from '../controllers/category.js'
import data from '../sampledata.js'
import Category from '../models/category.js'

const router = express.Router()

//post
router.post('/send', async (req, res) => {
  await Category.deleteMany({})
  const categories = await Category.insertMany(data.categories)
  res.send({ categories })
})

//get all category
router.get('/', getProductCategory)

export default router
