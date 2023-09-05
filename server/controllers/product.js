import { customError } from '../config/error.js'
import User from '../models/auth.js'
import Product from '../models/product.js'

export const getProductsByNewOrPreorder = async (req, res, next) => {
  try {
    const newProducts = await Product.find({
      condition: 'New',
    })
    const preorder = await Product.find({
      condition: 'Preorder',
    })
    if (!newProducts || !preorder)
      return next(customError(404, "Can't find products!"))
    res.status(200).json(newProducts.concat(preorder))
  } catch (err) {
    res.status(500).json(err)
  }
}
export const getProductsByFeatured = async (req, res, next) => {
  try {
    const products = await Product.find({
      isFeatured: true,
    })
    if (!products)
      return next(customError(404, "Can't find featured products!"))
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json(err)
  }
}
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    if (!products) return next(customError(404, "Can't get all products!"))
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json(err)
  }
}

//get all products by category
export const getProductsByCat = async (req, res, next) => {
  const catId = req.params.catId
  try {
    const products = await Product.find({ category: catId })
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const searchProducts = async (req, res) => {
  const query = req.query.q
  try {
    const product = await Product.find({
      title: { $regex: query, $options: 'i' },
    })
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const likeProduct = async (req, res) => {
  const id = req.user.id
  const productId = req.params.productId
  try {
    await Product.findByIdAndUpdate(productId, {
      $addToSet: { likes: id },
    })
    res.status(200).json('Product liked')
  } catch (err) {
    res.status(500).json(err)
  }
}

export const dislikeProduct = async (req, res) => {
  const id = req.user.id
  const productId = req.params.productId
  try {
    await Product.findByIdAndUpdate(productId, {
      $pull: { likes: id },
    })
    res.status(200).json('Product disliked.')
  } catch (err) {
    res.status(500).json(err)
  }
}

export const getUserLikedProduct = async (req, res) => {
  const { username } = req.params
  const id = req.user.id
  try {
    const user = await User.findOne({ username })
    if (!user) return next(customError(500, "Can't find user"))
    if (user) {
      const liked = await Product.find({ likes: id })
      res.status(200).json(liked)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id)
    res.status(200).json('Product deleted successfully')
  } catch (err) {
    res.status(500).json(err)
  }
}

export const createNewProduct = async (req, res) => {
  try {
    const product = await Product.insertMany(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json(err)
  }
}
