import { useEffect } from 'react'
import { useStore } from '../../../hooks/store'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2 } from 'react-feather'
import useDataFetching from '../../../hooks/fetchData'
import { dislikeProduct, getUserLikedProducts } from '../../../config/api'
import Loader from '../../../utils/Loader'
import { Col, Image, Row, Button } from 'react-bootstrap'
import { formatCurrency } from '../../../utils/formatCurrency'
import { toast } from 'react-hot-toast'

export default function Wishlist() {
  const { currentUser, increaseBagQuantity } = useStore()
  const { username } = useParams()
  const { error, data, loading } = useDataFetching(
    getUserLikedProducts,
    username,
    currentUser?.access_token
  )
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `${currentUser?.user?.username} wishlist `
  }, [currentUser?.user?.username])

  const addToBag = (item) => {
    increaseBagQuantity(item)
    navigate('/bag')
  }

  const removeFromWishlist = async (item) => {
    try {
      await dislikeProduct(
        item,
        currentUser?.user?._id,
        currentUser?.access_token
      )
      toast.success('Product successfully removed from your saved items')
      navigate(0)
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    }
  }

  {
    error && <p className='mt-5 fs-5'>{error.message}</p>
  }
  return (
    <>
      <h1 className='fs-5 fw-bold mb-4'>Saved items</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {data?.length > 0 ? (
            <>
              {data?.map((item) => (
                <Row
                  key={item._id}
                  className='py-2 mb-4 align-items-center justify-content-between border bg-white'
                >
                  <Col md={8} className='mb-4'>
                    <div className='d-flex align-items-center gap-3'>
                      <Image
                        src={item?.images[0]}
                        title={item.title}
                        alt={item.title}
                        style={{
                          width: '90px',
                          height: '100px',
                          objectFit: 'contain',
                        }}
                      />
                      <div>
                        <span className='fs-5'>{item.title}</span>
                        <div>
                          <span className='fs-6'>{item.category}</span>
                          <br />
                          <span className='fs-6 fw-bold'>
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={3} className='mb-4'>
                    <div className='d-flex align-items-center gap-lg-4 justify-content-between justify-content-lg-start qtyBox'>
                      <Button
                        variant='dark'
                        className='rounded-0'
                        onClick={() => addToBag(item)}
                      >
                        ADD TO BAG
                      </Button>
                      <Trash2
                        type='button'
                        size='16px'
                        title='remove'
                        onClick={() => removeFromWishlist(item._id)}
                        className='hideTrash'
                      />
                    </div>
                  </Col>
                </Row>
              ))}
            </>
          ) : (
            <h1 className='fs-6'>
              Sorry, you have no saved items in your wishlist.
            </h1>
          )}
        </>
      )}
    </>
  )
}
