import { useParams } from 'react-router-dom'
import { useState, useEffect, useReducer, useCallback } from 'react'
import Breadcrumbs from '../utils/Breadcrumbs'
import { Row, Col, Image, Button, Container } from 'react-bootstrap'
import { HandThumbUpIcon } from '@heroicons/react/24/solid'
import useDataFetching from '../hooks/fetchData'
import {
  dislikeProduct,
  getAllPoducts,
  getOneProduct,
  likeProduct,
} from '../config/api'
import Loader from '../utils/Loader'
import { formatCurrency } from '../utils/formatCurrency'
import { ImageModal, PageLayout, ProductCard } from '../components'
import { useStore } from '../hooks/store'
import { toast } from 'react-hot-toast'
import { initialState, productReducer } from '../reducers/productReducer'

export default function ProductDetail() {
  const { slug } = useParams()
  const [state, dispatch] = useReducer(productReducer, initialState)
  const { data: allProducts, error, loading } = useDataFetching(getAllPoducts)
  const [current, setCurrent] = useState(0)
  const [showPicModal, setShowPicModal] = useState(false)
  const { increaseBagQuantity, setShow, currentUser } = useStore()

  const suggestedProducts = allProducts?.filter(
    (product) => product.category !== state?.product?.category
  )

  const randomSuggestions = () => {
    const shuffled = suggestedProducts?.sort(() => 0.5 - Math.random())
    return shuffled?.slice(0, 7)
  }
  const randomProduct = randomSuggestions()

  const addToBag = (item) => {
    increaseBagQuantity(item)
    toast.success(`${item.title} added to bag`)
    setShow(true)
  }

  const getProductDetail = useCallback(async () => {
    dispatch({
      type: 'PRODUCT_REQUEST',
    })
    try {
      const res = await getOneProduct(slug)
      dispatch({
        type: 'GET_PRODUCT_DETAIL_SUCCESS',
        payload: res.data,
      })
    } catch (error) {
      console.error(error)
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: error.message,
      })
      toast.error(error.message)
    } finally {
      dispatch({
        type: 'END_REQUEST',
      })
    }
  }, [slug])

  const handleLike = async () => {
    try {
      if (!currentUser) {
        toast.error('Pls sign in to like')
      }
      await likeProduct(
        state?.product._id,
        currentUser?.user?._id,
        currentUser?.access_token
      )
      getProductDetail()
      toast.success(`You liked this`)
    } catch (error) {
      toast.error('Error liking product')
    }
  }

  const handleDislike = async () => {
    try {
      await dislikeProduct(
        state?.product._id,
        currentUser?.user?._id,
        currentUser?.access_token
      )
      getProductDetail()
      toast.success(`You disliked this`)
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  useEffect(() => {
    document.title = state?.product?.title
    window.scrollTo({ top: '0' })
    getProductDetail()
  }, [state?.product?.title, getProductDetail])

  return (
    <>
      <PageLayout>
        <Breadcrumbs />
        {state?.loading && <Loader />}
        <Row className='justify-content-around g-4 mt-2'>
          {state?.errorMessage && <span>{state?.errorMessage}</span>}
          <Col lg={6} className='mb-5'>
            <Row className='g-2'>
              {state?.product?.images?.map((image, i) => (
                <Col xs={6} key={i}>
                  <Image
                    src={image}
                    alt={state?.product.title}
                    title={state?.product.title}
                    className='w-100 h-100'
                    loading='lazy'
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowPicModal(true)
                      setCurrent(i)
                    }}
                  />
                  {showPicModal && (
                    <ImageModal
                      setShowPicModal={setShowPicModal}
                      showPicModal={showPicModal}
                      current={current}
                      setCurrent={setCurrent}
                      data={state?.product}
                    />
                  )}
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={3}>
            {state?.product && (
              <>
                <h1 className='fw-bold fs-3'>{state?.product?.title}</h1>
                <div className='mt-3 d-flex justify-content-between align-items-center'>
                  <span className='fs-5'>
                    Brand: <b>{state?.product?.brand}</b>
                  </span>

                  <HandThumbUpIcon
                    color={
                      state?.product?.likes?.includes(currentUser?.user?._id)
                        ? 'red'
                        : ''
                    }
                    title={
                      state?.product?.likes?.includes(currentUser?.user?._id)
                        ? 'You like this product'
                        : 'Like this product'
                    }
                    style={{ height: '24px', width: '24px', cursor: 'pointer' }}
                    onClick={
                      state?.product?.likes?.includes(currentUser?.user?._id)
                        ? handleDislike
                        : handleLike
                    }
                  />
                </div>
                <p className='mt-3 fs-5'>
                  {formatCurrency(state?.product?.price)}
                </p>
                <Button
                  variant='dark'
                  className='mt-3 w-100 rounded-0'
                  onClick={() => addToBag(state?.product)}
                >
                  ADD TO BAG
                </Button>
                <div className='mt-5'>
                  <p className='fw-bold fs-6 text-uppercase'>
                    Product description
                  </p>
                  <p className='fs-6'>{state?.product?.description}</p>
                </div>
                {state?.product?.extra?.length > 0 && (
                  <div className='mt-5'>
                    <hr />
                    <p className='fw-bold fs-6 text-uppercase'>ADDITIONAL</p>
                    {state?.product.extra.map((ex, i) => (
                      <p key={i} className='fs-6'>
                        - {ex}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </PageLayout>
      <h1 className='mt-5 text-center fw-bold fs-4'>You may also like</h1>
      <Container fluid className='mt-4 p-1'>
        {error && <span>{error.message}</span>}
        {loading ? (
          <Loader />
        ) : (
          <div
            className='d-flex gap-4 overflow-x-scroll overflow-y-hidden scrollbody'
            style={{ height: '100%' }}
          >
            {randomProduct?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
