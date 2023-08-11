import { HeaderLayout, PageLayout } from '../components'
import Breadcrumbs from '../utils/Breadcrumbs'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import registerOptions from '../utils/formValidate'
import { Button } from 'react-bootstrap'
import { generateOTP, getUsername, verifyOTP } from '../config/api'

export default function Recover() {
  const [OTP, setOTP] = useState()
  const [showNext, setShowNext] = useState(1)
  const navigate = useNavigate()

  const username = sessionStorage.getItem('username')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    document.title = `Recover password`
  }, [])

  const usernameHandler = async (data) => {
    try {
      const res = await getUsername(data.username)
      sessionStorage.setItem('username', data.username)
      if (res.status === 200) {
        setShowNext((showNext) => showNext + 1)
        generateOTP(data.username).then((OTP) => {
          console.log(OTP)
          if (OTP) return toast.success('OTP has been send to your email!')
          return toast.error('Problem while generating OTP!')
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('username does not exist')
    }
  }

  const otpHandler = async () => {
    try {
      let { status } = await verifyOTP({ username, code: OTP })
      if (status === 201) {
        toast.success('Verified Successfully!')
        navigate('/reset-password')
      }
    } catch (error) {
      return toast.error('Wrong OTP! Check email again!')
    }
  }

  const resendOTP = () => {
    let sentPromise = generateOTP(username)
    toast.promise(sentPromise, {
      loading: 'Sending...',
      success: <b>OTP has been send to your email!</b>,
      error: <b>Could not Send it!</b>,
    })

    sentPromise.then((OTP) => {
      console.log(OTP)
    })
  }

  return (
    <PageLayout>
      <Breadcrumbs />
      <HeaderLayout heading='Recover password' />
      <h1 className='text-center mb-4'>
        {showNext === 1 ? 'Verify username' : 'Enter OTP'}
      </h1>
      {showNext === 1 && (
        <form
          className='d-flex flex-column mx-auto'
          onSubmit={handleSubmit(usernameHandler)}
          style={{ maxWidth: '300px' }}
        >
          <div className='mb-3 inputRegBox'>
            <input
              type='text'
              placeholder='Username'
              id='username'
              className='w-100 inputReg mb-0'
              autoFocus
              {...register(`username`, registerOptions.username)}
            />
            {errors?.username?.message && (
              <p className='text-danger fs-6'>{errors.username.message}</p>
            )}
          </div>
          <Button type='submit' variant='dark' className='w-100 rounded-0'>
            Next
          </Button>
        </form>
      )}
      {showNext === 2 && (
        <form
          className='d-flex flex-column mx-auto'
          onSubmit={handleSubmit(otpHandler)}
          style={{ maxWidth: '300px' }}
        >
          <div className='mb-3 inputRegBox'>
            <input
              type='text'
              placeholder='OTP PIN'
              id='otp'
              className='w-100 inputReg mb-0'
              onChange={(e) => setOTP(e.target.value)}
            />
          </div>
          <div className='mb-3 inputRegBox'>
            <Button
              type='submit'
              variant='dark'
              className='w-100 rounded-0 mb-3'
            >
              PROCEED
            </Button>
            <Button
              type='submit'
              variant='outline-dark'
              className='w-100 rounded-0'
              onClick={resendOTP}
            >
              RESEND OTP
            </Button>
          </div>
        </form>
      )}
    </PageLayout>
  )
}
