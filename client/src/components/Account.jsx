import { useState } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { User, X, Eye, EyeOff } from 'react-feather'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import registerOptions from '../utils/formValidate'
import { loginUser, registerUser } from '../config/api'
import { useStore } from '../hooks/store'

export default function Account() {
  const [show, setShow] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordShown, setPasswordShown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { setCurrentUser } = useStore()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const from = location.state?.from || '/'

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  const switchMode = () => {
    setIsSignup((prev) => !prev)
  }

  const onSubmitHandler = async ({ username, email, password }) => {
    setLoading(true)
    try {
      if (isSignup) {
        const res = await registerUser(username, email, password)
        if (res.status === 201) {
          setCurrentUser(res.data)
          toast.success('Registration successfull')
          navigate(from, { replace: true })
          handleClose()
        }
      } else {
        const res = await loginUser(username, password)
        if (res.status === 200) {
          setCurrentUser(res.data)
          toast.success('Logged in successfully')
          navigate(from, { replace: true })
          handleClose()
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('Invalid details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <User type='button' size='30px' onClick={handleShow} />
      <Modal show={show} onHide={handleClose} backdrop='static' centered>
        <Modal.Body>
          <div className='text-end w-100'>
            <X type='button' size='30px' onClick={handleClose} />
          </div>
          <div>
            <h1 className='text-center'>
              {isSignup ? 'Create account' : 'Login'}
            </h1>
            <form
              className='d-flex flex-column align-items-center w-100'
              onSubmit={handleSubmit(onSubmitHandler)}
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
              {isSignup && (
                <div className='mb-3 inputRegBox'>
                  <input
                    type='email'
                    placeholder='Email'
                    id='email'
                    className='w-100 inputReg mb-0'
                    {...register(`email`, registerOptions.email)}
                  />
                  {errors?.email?.message && (
                    <p className='text-danger fs-6'>{errors.email.message}</p>
                  )}
                </div>
              )}
              <div className='inputRegBox position-relative'>
                <input
                  type={passwordShown ? 'text' : 'password'}
                  placeholder='Password'
                  id='password'
                  className='w-100 inputReg mb-1'
                  {...register(`password`, registerOptions.password)}
                />
                {passwordShown ? (
                  <EyeOff
                    className='position-absolute end-0 translate-middle'
                    type='button'
                    style={{ top: isSignup ? '50%' : '25%' }}
                    onClick={togglePassword}
                  />
                ) : (
                  <Eye
                    className='position-absolute end-0 translate-middle'
                    type='button'
                    style={{ top: isSignup ? '50%' : '25%' }}
                    onClick={togglePassword}
                  />
                )}
                {errors?.password?.message && (
                  <p className='fs-6 text-danger mb-1'>
                    {errors.password.message}
                  </p>
                )}
                {!isSignup && (
                  <Link to='recover-password' onClick={handleClose}>
                    <p className='fs-6 text-black text-decoration-underline mb-4'>
                      Forgot your password
                    </p>
                  </Link>
                )}
              </div>

              <Button
                variant='dark'
                type='submit'
                size='lg'
                className='my-4 rounded-0 shadow inputRegBox'
              >
                {loading ? (
                  <Spinner animation='border' size='sm' />
                ) : isSignup ? (
                  'Create'
                ) : (
                  'Sign in'
                )}
              </Button>

              {isSignup ? (
                <p
                  className='fs-6 text-secondary-subtle'
                  type='button'
                  onClick={switchMode}
                >
                  Already have an account?{' '}
                  <span className='text-black text-decoration-underline fs-5'>
                    Sign in here
                  </span>
                </p>
              ) : (
                <p
                  className='fs-5 text-decoration-underline'
                  type='button'
                  onClick={switchMode}
                >
                  Create account
                </p>
              )}
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
