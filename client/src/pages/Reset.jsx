import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'react-feather'
import { HeaderLayout, PageLayout } from '../components'
import Breadcrumbs from '../utils/Breadcrumbs'
import registerOptions from '../utils/formValidate'
import { Button } from 'react-bootstrap'
import { resetPassword } from '../config/api'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useStore } from '../hooks/store'

export default function Reset() {
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { togglePassword, passwordShown } = useStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const username = sessionStorage.getItem('username')

  useEffect(() => {
    document.title = 'Reset password'
    const createSession = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/createResetSession`
        )
        if (res.status !== 200) return <Navigate to={`/`} replace={true} />
      } catch (error) {
        console.error(error)
        setError(error)
      }
    }
    createSession()
  }, [])

  const onSubmit = async ({ password, confirmPassword }, e) => {
    e.preventDefault()
    try {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
      } else {
        const res = await resetPassword({ username, password })
        if (res.status === 201) {
          toast.success('Password reset successful, log in to continue')
          sessionStorage.removeItem('username')
          navigate('/')
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('There was a problem reseting your password')
    }
  }

  return (
    <PageLayout>
      <Breadcrumbs />
      <HeaderLayout heading='Reset password' />
      <form
        className='d-flex flex-column align-items-center justify-content-center w-100'
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && <p className='fs-5'>{error.message}</p>}
        <div className='inputRegBox mb-2 position-relative'>
          <input
            type={passwordShown ? 'text' : 'password'}
            placeholder='Password'
            id='password'
            autoFocus
            className='w-100 inputReg mb-0'
            {...register(`password`, registerOptions.password)}
          />
          {passwordShown ? (
            <EyeOff
              className='position-absolute end-0 translate-middle'
              style={{ top: '50%', cursor: 'pointer' }}
              onClick={togglePassword}
            />
          ) : (
            <Eye
              className='position-absolute end-0 translate-middle'
              style={{ top: '50%', cursor: 'pointer' }}
              onClick={togglePassword}
            />
          )}
        </div>
        {errors?.password?.message && (
          <p className='fs-6 text-danger mb-2 inputRegBox'>
            {errors.password.message}
          </p>
        )}
        <div className='inputRegBox mb-2 position-relative'>
          <input
            type={passwordShown ? 'text' : 'password'}
            placeholder='Confirm password'
            id='confirmPassword'
            className='w-100 inputReg mb-0'
            {...register(`confirmPassword`, registerOptions.confirmPassword)}
          />
          {passwordShown ? (
            <EyeOff
              className='position-absolute end-0 translate-middle'
              style={{ top: '50%', cursor: 'pointer' }}
              onClick={togglePassword}
            />
          ) : (
            <Eye
              className='position-absolute end-0 translate-middle'
              style={{ top: '50%', cursor: 'pointer' }}
              onClick={togglePassword}
            />
          )}
        </div>
        {errors?.confirmPassword?.message && (
          <p className='fs-6 text-danger mb-2 inputRegBox'>
            {errors.confirmPassword?.message}
          </p>
        )}
        <Button
          variant='dark'
          type='submit'
          size='lg'
          className='my-2 rounded-0 shadow inputRegBox'
        >
          RESET
        </Button>
      </form>
    </PageLayout>
  )
}
