import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import { config } from 'dotenv'

config()

let nodeConfig = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAIL_EMAIL, // generated ethereal user
    pass: process.env.NODEMAIL_PASSWORD, // generated ethereal password
  },
}

//create transport
let transporter = nodemailer.createTransport(nodeConfig)

let mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Mailgen',
    link: 'https://mailgen.js/',
  },
})

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body

  //email body
  var email = {
    body: {
      name: username,
      intro: text || 'Welcome to Shop n buy!.',
      outro:
        'Need help? simply reply to this mail and have your questions answered.',
    },
  }
  var emailBody = mailGenerator.generate(email)

  let message = {
    from: process.env.NODEMAIL_EMAIL,
    to: userEmail,
    subject: subject || 'Signup successfull',
    html: emailBody,
  }
  //send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .json({ msg: 'You should receive an email from us.' })
    })
    .catch((error) => res.status(500).json({ error: error.message }))
}
