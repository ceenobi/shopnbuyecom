import Category from '../models/category.js'

//get categories
export const getProductCategory = async (req, res) => {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (err) {
    res.status(500).json(err)
  }
}
