import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'react-feather'
import { Button, Spinner } from 'react-bootstrap'
import { updateUserProfile, uploadToCloudinary } from '../config/api'
import { useStore } from '../hooks/store'
import { useNavigate } from 'react-router-dom'
import registerOptions from '../utils/formValidate'

export default function UpdateProfile() {
  const [imgPic, setImgPic] = useState('')
  const [imgLink, setImgLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { currentUser, setCurrentUser, togglePassword, passwordShown } =
    useStore()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.user?.username,
      email: currentUser?.user?.email,
      password: '',
    },
  })

  const handleUploadPic = useCallback(async () => {
    try {
      const upload = await uploadToCloudinary(imgPic)
      const updatedProfileImg = upload.data.secure_url
      setImgLink(updatedProfileImg)
    } catch (error) {
      console.error(error)
      toast.error('Error uploading image')
    }
  }, [imgPic])

  useEffect(() => {
    if (imgPic !== '') {
      handleUploadPic()
    }
  }, [handleUploadPic, imgPic])

  const onSubmitHandler = async (data) => {
    setLoading(true)
    const updatedProfile = {
      _id: currentUser?.user?._id,
      username: data.username,
      email: data.email,
      password: data.password,
      profileImg: imgLink,
    }
    try {
      const res = await updateUserProfile(
        updatedProfile,
        currentUser?.access_token
      )
      if (res.status === 201) {
        toast.success('Your profile was updated successfully')
        setCurrentUser(res.data)
        navigate(`/account/user-profile/${res.data?.user?.username}`)
      } else {
        toast.error('Error updating your profile')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error updating your profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='inputRegBox mx-auto'>
        <h1 className='text-center'>Update profile</h1>
      </div>
      <form
        className='d-flex flex-column align-items-center w-100'
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className='mb-3 inputRegBox'>
          <input
            type='text'
            placeholder='Username'
            id='username'
            name='username'
            className='w-100 inputReg mb-0'
            autoFocus
            {...register('username', registerOptions.username)}
          />
          {errors?.username?.message && (
            <p className='text-danger fs-6 mb-0'>{errors.username.message}</p>
          )}
        </div>
        <div className='mb-3 inputRegBox'>
          <input
            type='email'
            placeholder='Email'
            id='email'
            name='email'
            className='w-100 inputReg mb-0'
            {...register('email', registerOptions.email)}
          />
          {errors?.email?.message && (
            <p className='text-danger fs-6 mb-0'>{errors.email.message}</p>
          )}
        </div>
        <div
          className=' inputRegBox mb-1 fs-5'
          onClick={() => setShowPass(!showPass)}
        >
          Update password?{' '}
          <span
            className={
              showPass
                ? 'text-success fw-medium fs-5'
                : 'text-black fw-medium fs-5'
            }
          >
            {showPass ? 'hide' : 'click to update'}
          </span>
        </div>
        {showPass && (
          <div className='mb-1 inputRegBox position-relative'>
            <input
              type={passwordShown ? 'text' : 'password'}
              placeholder='Password'
              id='password'
              name='password'
              className='w-100 inputReg mb-0'
              {...register('password', registerOptions.password)}
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
        )}
        {errors?.password?.message && (
          <p className='text-danger fs-6 inputRegBox '>
            {errors.password.message}
          </p>
        )}
        <div className='my-3 inputRegBox'>
          <label htmlFor='profilepic'>Upload profile image</label>
          <input
            type='file'
            name='profilepic'
            accept='image/png, image/jpeg, image/webp'
            id='profilepic'
            className='w-100 mb-0 p-2 border border-black'
            onChange={(e) => setImgPic(e.target.files[0])}
          />
        </div>
        <div className='mb-3 inputRegBox'>
          <Button type='submit' variant='dark' className='w-100 rounded-0'>
            {loading ? <Spinner animation='border' size='sm' /> : 'Update'}
          </Button>
        </div>
      </form>
    </>
  )
}
