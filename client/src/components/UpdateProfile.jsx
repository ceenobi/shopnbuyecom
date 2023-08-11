import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Button, Spinner } from 'react-bootstrap'
import { updateUserProfile, uploadToCloudinary } from '../config/api'
import { useStore } from '../hooks/store'
import { useNavigate } from 'react-router-dom'

export default function UpdateProfile() {
  const [imgPic, setImgPic] = useState('')
  const [imgLink, setImgLink] = useState('')
  const [loading, setLoading] = useState(false)
  const { currentUser, setCurrentUser } = useStore()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleUploadPic = useCallback(async () => {
    try {
      const upload = await uploadToCloudinary(imgPic)
      const updatedProfileImg = upload.data.secure_url
      setImgLink(updatedProfileImg)
    } catch (error) {
      console.error(error)
      toast.error('error uploading image')
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
        setCurrentUser(res.data)
        toast.success('User profile updated successfully')
        navigate(0)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
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
            {...register('username', {
              minLength: {
                value: 6,
                message: 'Username should be at-least 4 characters.',
              },
            })}
          />
          {errors?.username && (
            <p className='text-danger fs-6'>{errors.username.message}</p>
          )}
        </div>
        <div className='mb-3 inputRegBox'>
          <input
            type='email'
            placeholder='Email'
            id='email'
            name='email'
            className='w-100 inputReg mb-0'
            {...register('email', {
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: 'Email is not valid.',
              },
            })}
          />
          {errors?.email && (
            <p className='text-danger fs-6'>{errors.email.message}</p>
          )}
        </div>
        <div className='mb-3 inputRegBox'>
          <input
            type='password'
            placeholder='Password'
            id='password'
            name='password'
            className='w-100 inputReg mb-0'
            {...register(`password`, {
              minLength: {
                value: 6,
                message: 'Password should be at-least 6 characters.',
              },
              validate: {
                matchPattern: (v) =>
                  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/.test(
                    v
                  ) ||
                  'Password must have special character, number and uppercase',
              },
            })}
          />
          {errors?.password && (
            <p className='text-danger fs-6'>{errors.password.message}</p>
          )}
        </div>
        <div className='mb-3 inputRegBox'>
          <label htmlFor='profilepic'>Upload profile image</label>
          <input
            type='file'
            name='profilepic'
            accept='image/png, image/jpeg, image/webp'
            id='profilepic'
            className='w-100 mb-0 p-2 border'
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
