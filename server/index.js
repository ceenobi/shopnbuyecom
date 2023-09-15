import { config } from 'dotenv'
import express, { json } from 'express'
import cors from 'cors'
import { connectToDB } from './config/mongoDb.js'
import categoryRoutes from './routes/categories.js'
import productRoutes from './routes/products.js'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'

const app = express()
config()
app.use(cors())
app.use(json())
app.disable('x-powered-by')

app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/order', orderRoutes)

app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})

const PORT = process.env.PORT || 5000
connectToDB()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log(`Server connected to http://localhost:${PORT}`)
      })
    } catch (error) {
      console.log('Cannot connect to the server')
    }
  })
  .catch((error) => {
    console.log('Invalid database connection...!')
  })

app.get('/', (req, res) => {
  res.send('app is running')
})
