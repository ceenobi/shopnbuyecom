import Order from '../models/order.js'

//create order
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingDetails,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body
    if (orderItems && orderItems.length === 0) {
      res.status(400)
      throw new Error('No order item')
    } else {
      const order = new Order({
        user: req.user.id,
        orderItems,
        shippingDetails,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: paymentMethod === 'Paypal' ? true : false,
        paidAt: paymentMethod === 'Paypal' ? Date.now() : '',
        status: paymentMethod === 'Paypal' ? 1 : 0,
      })
      const createOrder = await order.save()
      res.status(201).json(createOrder)
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

//get order by user
export const getUserOrders = async (req, res) => {
  try {
    const order = await Order.find({ user: req.user.id }).sort({ _id: -1 })
    res.json(order)
  } catch (err) {
    res.status(500).json(err)
  }
}

//get orderdetail
export const getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'username email'
    )
    if (order) {
      res.json(order)
      return
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

//get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 })
    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json(err)
  }
}

//track an order
export const trackOrders = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (order.paymentMethod === 'Cash' && order.status === 2) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }
    if (order.paymentMethod === 'Paypal' && order.status === 2) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }
    const updatedOrder = await order.save()
    res.status(201).json(updatedOrder)
  } catch (err) {
    res.status(500).json(err)
  }
}
