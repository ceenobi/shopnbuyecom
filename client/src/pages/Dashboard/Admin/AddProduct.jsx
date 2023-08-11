import { useEffect, useState } from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { createNewProduct, uploadToCloudinary } from '../../../config/api'
import { useStore } from '../../../hooks/store'
import { toast } from 'react-hot-toast'
import Loader from '../../../utils/Loader'

export default function AddProduct() {
  const [extra, setExtra] = useState('')
  const [extraOptions, setExtraOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { currentUser } = useStore()

  useEffect(() => {
    document.title = `Add a new product`
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const addExtra = () => {
    if (extra !== '') {
      setExtraOptions(extraOptions, extraOptions.push(extra))
      setExtra('')
    }
  }

  const onSubmitHandler = async (data) => {
    setLoading(true)
    let productImgs = []
    try {
      for (let i = 0; i < data.productpic.length; i++) {
        const upload = await uploadToCloudinary(data.productpic[i])
        console.log('iuii', upload.data.secure_url)
        const url = upload.data.secure_url
        productImgs.push(url)
      }
      const newProduct = {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        color: data.color,
        brand: data.brand,
        condition: data.condition,
        isFeatured: data.isFeatured,
        extra: extraOptions,
        images: productImgs,
      }
      const res = await createNewProduct(newProduct, currentUser?.access_token)
      if (res.status === 201) {
        toast.success(`Product created successfully`)
        reset(data)
      }
    } catch (error) {
      console.log(error)
      setError(error)
      toast.error(`There was a problem creating your product`)
    } finally {
      setLoading(false)
    }
  }

  {
    error && <p className='mt-5 fs-5'>{error.message}</p>
  }

  return (
    <>
      <h1 className='fs-5 fw-bold mb-4'>Add a new product to database</h1>
      {loading ? (
        <>
          <Loader />
          <p className='text-center fs-5'>Uploading product...</p>
        </>
      ) : (
        <form className=' w-100' onSubmit={handleSubmit(onSubmitHandler)}>
          <Row>
            <Col md={6} className='mb-4'>
              <div className='mb-4 inputRegBox'>
                <input
                  type='text'
                  placeholder='Title'
                  id='title'
                  name='title'
                  className='w-100 inputReg mb-0'
                  autoFocus
                  {...register('title', {
                    required: 'Email is required.',
                  })}
                />
                {errors?.title && (
                  <p className='text-danger fs-6'>{errors.title.message}</p>
                )}
              </div>
              <div className='mb-4 inputRegBox'>
                <textarea
                  placeholder='Description'
                  id='description'
                  name='description'
                  className='w-100 inputReg mb-0'
                  {...register('description', {
                    required: 'Description is required.',
                  })}
                />
                {errors?.description && (
                  <p className='text-danger fs-6'>
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className='mb-4 inputRegBox'>
                <label htmlFor='productpic'>Upload product images</label>
                <input
                  type='file'
                  name='productpic'
                  multiple={true}
                  accept='image/png, image/jpeg, image/webp'
                  id='productpic'
                  className='w-100 mb-0 p-2 border'
                  {...register('productpic', {
                    required: 'Image is required.',
                  })}
                />
                {errors?.productpic && (
                  <p className='text-danger fs-6'>
                    {errors.productpic.message}
                  </p>
                )}
              </div>
              <div className='mb-4 inputRegBox'>
                <input
                  type='number'
                  placeholder='Price'
                  id='price'
                  name='price'
                  className='w-100 inputReg mb-0'
                  {...register('price', {
                    required: 'Price is required.',
                  })}
                />
                {errors?.price && (
                  <p className='text-danger fs-6'>{errors.price.message}</p>
                )}
              </div>
              <div className='mb-4 inputRegBox'>
                <label htmlFor='category' className='me-2 fw-medium fs-5'>
                  Select Category
                </label>
                <select
                  name='category'
                  id='category'
                  className='px-3 py-1'
                  {...register('category', {
                    required: 'Category is required.',
                  })}
                >
                  <option>Select...</option>
                  <option value='Fashion'>Fashion</option>
                  <option value='Beauty'>Beauty</option>
                  <option value='Furniture'>Furniture</option>
                  <option value='Watch'>Watch</option>
                </select>
                {errors?.category && (
                  <p className='text-danger fs-6'>{errors.category.message}</p>
                )}
              </div>
            </Col>
            <Col md={6} className='mb-4'>
              <div className='mb-4 inputRegBox'>
                <input
                  type='text'
                  placeholder='Brand'
                  id='brand'
                  name='brand'
                  className='w-100 inputReg mb-0'
                  {...register('brand', {
                    required: 'Brand is required.',
                  })}
                />
                {errors?.brand && (
                  <p className='text-danger fs-6'>{errors.brand.message}</p>
                )}
              </div>
              <div className='mb-4 inputRegBox'>
                <input
                  type='text'
                  placeholder='Color'
                  id='color'
                  name='color'
                  className='w-100 inputReg mb-0'
                  {...register('color')}
                />
              </div>
              <div className='mb-4 inputRegBox'>
                <label htmlFor='condition' className='me-2 fs-5 fw-medium'>
                  Condition
                </label>
                <select
                  name='condition'
                  id='condition'
                  className='px-3 py-1'
                  {...register('condition')}
                >
                  <option>Select...</option>
                  <option value='New'>New</option>
                  <option value='Preorder'>Preorder</option>
                </select>
              </div>
              <div className='mb-3'>
                <h1 className='fs-5'>is Product Featured?</h1>
                <div>
                  <input
                    type='radio'
                    id='producta'
                    name='isFeatured'
                    value={true}
                    {...register('isFeatured', { required: true })}
                  />
                  <label htmlFor='producta' className='mx-2'>
                    True
                  </label>
                </div>
                <div>
                  <input
                    type='radio'
                    id='productb'
                    name='isFeatured'
                    value={false}
                    checked
                    {...register('isFeatured', { required: true })}
                  />
                  <label htmlFor='productb' className='mx-2'>
                    False
                  </label>
                </div>
              </div>
              <div className=''>
                <div className='d-flex gap-3 mb-0 inputRegBox'>
                  <input
                    type='text'
                    placeholder='Extra'
                    id='extra'
                    name='extra'
                    className='w-100 inputReg mb-2'
                    value={extra}
                    onChange={(e) => setExtra(e.target.value)}
                  />
                </div>
                <div className='d-flex gap-2 mb-0'>
                  {extraOptions.map((option, i) => (
                    <p
                      key={i}
                      className='fs-6 bg-success p-1 rounded-2 text-white'
                    >
                      {option}
                    </p>
                  ))}
                </div>
                <Button
                  variant='dark'
                  type='button'
                  className='rounded-0'
                  onClick={addExtra}
                >
                  Add Tag
                </Button>
              </div>
            </Col>
          </Row>
          <div className='my-5 inputRegBox mx-auto'>
            <Button type='submit' variant='dark' className='w-100 rounded-0'>
              Add Product
            </Button>
          </div>
        </form>
      )}
    </>
  )
}
