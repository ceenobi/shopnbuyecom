import mongoose from 'mongoose'
import mongooseSlugPlugin from 'mongoose-slug-plugin'

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 60,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    extra: {
      type: [String],
    },
    category: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    brand: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
    },
    price: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

const Product =
  mongoose.models.Product ||
  mongoose.model(
    'Product',
    productSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>' })
  )

export default Product
