import axios from 'axios'
import jwt_decode from 'jwt-decode'
import {
  instance,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_URL,
} from '../config/connect'

//product
export const getCategories = async () => {
  const res = await instance.get('/api/categories')
  return res
}
export const getNewOrPreorder = async () => {
  const res = await instance.get('/api/products/params')
  return res
}
export const getFeaturedPoducts = async () => {
  const res = await instance.get('/api/products/featured')
  return res
}
export const getAllPoducts = async () => {
  const res = await instance.get('/api/products')
  return res
}
export const getPoductsByCat = async (categoryId) => {
  const res = await instance.get(`/api/products/${categoryId}`)
  return res
}
export const getOneProduct = async (slug) => {
  const res = await instance.get(`/api/products/name/${slug}`)
  return res
}
export const searchProduct = async (searchquery) => {
  const res = await instance.get(
    `/api/products/search/product?q=${searchquery}`
  )
  return res
}

export const likeProduct = async (productId, userId, token) => {
  const res = await instance.put(`/api/products/${productId}/like`, userId, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}
export const dislikeProduct = async (productId, userId, token) => {
  const res = await instance.put(`/api/products/${productId}/dislike`, userId, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}

export const getUserLikedProducts = async (username, token) => {
  const res = await instance.get(`/api/products/userliked/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}

export const createNewProduct = async (product, token) => {
  const res = await instance.post('/api/products', product, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}

export const deleteProduct = async (productId, token) => {
  const res = await instance.delete(`/api/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}

//auth
export const registerUser = async (username, email, password) => {
  const res = await instance.post('/api/auth/register', {
    username,
    email,
    password,
  })
  if (res.status === 201) {
    await instance.post(`/api/auth/registerMail`, {
      username,
      userEmail: email,
      text: res.msg,
    })
  }
  return res
}
export const loginUser = async (username, password) => {
  const res = await instance.post('/api/auth/login', { username, password })
  return res
}
export const getUserProfile = async (username, token) => {
  const res = await instance.get(`/api/auth/user-profile/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}
export const getUsername = async (username) => {
  const res = await instance.get(`/api/auth/user/${username}`)
  return res
}

export const updateUserProfile = async (profile, token) => {
  const res = await instance.put('/api/auth/updateuser', profile, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}

export const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  const data = await axios.post(CLOUDINARY_URL, formData)
  return data
}

export const generateOTP = async (username) => {
  try {
    const {
      data: { code },
      status,
    } = await instance.get('/api/auth/generate-otp', { params: { username } })
    if (status === 201) {
      let {
        data: { email },
      } = await getUsername(username)
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`
      await instance.post('/api/auth/registerMail', {
        username,
        userEmail: email,
        text,
        subject: 'Password Recovery OTP',
      })
    }
    return Promise.resolve(code)
  } catch (error) {
    return { error: error }
  }
}

export const verifyOTP = async ({ username, code }) => {
  try {
    const { data, status } = await instance.get('/api/auth/verify-otp', {
      params: { username, code },
    })
    return { data, status }
  } catch (error) {
    return { error: error }
  }
}

export const resetPassword = async ({ username, password }) => {
  try {
    const res = await instance.put('/api/auth/reset-password', {
      username,
      password,
    })
    return res
  } catch (error) {
    return { error: error }
  }
}

export const decodeUserId = async (id) => {
  try {
    const res = await instance.get(`/api/auth/decodeId/${id}`)
    return res
  } catch (error) {
    return { error: 'Cannot find user by the id' }
  }
}

export async function verifyToken() {
  const token = localStorage.getItem('access_token')
  if (!token) return Promise.reject('Cannot find Token')
  let decode = jwt_decode(token)

  return decode
}

//orders
export const createOrder = async (order, token) => {
  const res = await instance.post('/api/order/create', order, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}
export const getUserOrders = async (token) => {
  const res = await instance.get(`/api/order/user`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}
export const getOrderDetail = async (orderId, token) => {
  const res = await instance.get(`/api/order/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}

export const getAllOrders = async (token) => {
  const res = await instance.get('/api/order', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}

export const trackOrders = async (id, status, token) => {
  const res = await instance.put(`/api/order/${id}/tracking`, status, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res
}
