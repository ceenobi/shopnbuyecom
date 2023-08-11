import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
  try {
    // access authorize header to validate request
    const token = req.headers.authorization.split(' ')[1]
    // retrive the user details fo the logged in user
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decodedToken
    next()
  } catch (err) {
    res.status(401).json({ err: 'Authentication Failed!' })
  }
}

export const localVariables = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  }
  next()
}
