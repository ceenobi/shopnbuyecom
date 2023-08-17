import bcrypt from 'bcrypt'
import otpGenerator from 'otp-generator'
import { customError } from '../config/error.js'
import generateToken from '../config/token.js'
import User from '../models/auth.js'

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, profileImg } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) return next(customError(404, 'User already exists'))
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
      profileImg:
        profileImg ||
        'https://res.cloudinary.com/ceenobi/image/upload/v1687743800/icon-256x256_d7vo98.png',
    })
    const user = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profileImg: newUser.profileImg,
    }
    const access_token = generateToken(newUser._id)
    res
      .status(201)
      .json({ access_token, user, msg: 'User registration successfull' })
  } catch (err) {
    res.status(500).json(err)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const userExists = await User.findOne({ username: username })
    if (!userExists) return next(customError(400, 'User does not exist'))
    const isMatch = await bcrypt.compare(password, userExists.password)
    if (!isMatch) return next(customError(400, 'Invalid credentials. '))
    const user = {
      _id: userExists._id,
      username: userExists.username,
      email: userExists.email,
      profileImg: userExists.profileImg,
      isAdmin: userExists.isAdmin,
    }
    const access_token = generateToken(userExists._id)
    res.status(200).json({ access_token, user, msg: 'Login Successfull' })
  } catch (err) {
    next(customError(500, err.message))
  }
}

export const getUser = async (req, res, next) => {
  const { username } = req.params
  try {
    const user = await User.findOne({ username })
    if (!user) return next(customError(500, "Can't find user"))
    const { password, ...rest } = user._doc
    res.status(200).json(rest)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const updateUser = async (req, res) => {
  const userId = await User.findById(req.user.id)
  try {
    if (userId) {
      userId.username = req.body.username || userId.username
      userId.email = req.body.email || userId.email
      userId.profileImg = req.body.profileImg || userId.profileImg
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      if (hashedPassword) {
        userId.password = hashedPassword
      }
      const updatedUser = await userId.save()
      const user = {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profileImg: updatedUser.profileImg,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
      }
      const access_token = generateToken(updatedUser._id)
      res.status(201).json({
        access_token,
        user,
        msg: 'User profile updated!',
      })
    } else {
      res.status(404)
      throw new Error('User profile not updated')
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

export const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  })
  res.status(201).json({ code: req.app.locals.OTP })
}

export const verifyOTP = async (req, res) => {
  const { code } = req.query
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null // reset the OTP value
    req.app.locals.resetSession = true // start session for reset password
    return res.status(201).json({ msg: 'Verified Successsfully!' })
  }
  return res.status(400).json({ error: 'Invalid OTP' })
}

export const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).json({ flag: req.app.locals.resetSession })
  }
  return res.status(440).json({ error: 'Session expired!' })
}

export const resetPassword = async (req, res, next) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).json({ error: 'Session expired!' })
    const { username, password } = req.body
    try {
      const findUser = User.findOne({ username })
      if (!findUser) return next(customError(404, 'User not found'))
      if (findUser) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatePassword = await User.updateOne(
          { username },
          { password: hashedPassword }
        )
        req.app.locals.resetSession = false
        return res
          .status(201)
          .json({ updatePassword, msg: 'Password Updated...!' })
      } else {
        return next(customError(500, 'Unable to hash password'))
      }
    } catch (err) {
      next(customError(500, err.message))
    }
  } catch (err) {
    res.status(404).json({ err })
  }
}
