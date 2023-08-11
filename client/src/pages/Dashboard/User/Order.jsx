import { getUserOrders } from '../../../config/api'
import { Link, useLocation, useParams, Outlet } from 'react-router-dom'
import { Button, Image, Row, Col } from 'react-bootstrap'
import Loader from '../../../utils/Loader'
import { useStore } from '../../../hooks/store'
import useDataFetching from '../../../hooks/fetchData'

export default function Order() {
  const { currentUser } = useStore()
  const { username } = useParams()
  const {
    data: orders,
    error,
    loading,
  } = useDataFetching(getUserOrders, currentUser?.access_token)
  const location = useLocation()

  {
    error && <p className='mt-5 fs-5'>{error.message}</p>
  }
  return (
    <>
      {location.pathname === `/account/${username}/orders` ? (
        <div style={{ height: '700px', overflow: 'scroll' }}>
          <h1 className='fs-5 fw-bold mb-4'>Your orders</h1>
          {loading ? (
            <Loader />
          ) : (
            <>
              {orders?.length > 0 ? (
                <>
                  {orders?.map((order, i) => (
                    <Row
                      className='p-2 mb-4 align-items-center border bg-white'
                      key={i}
                    >
                      <Col xs={12} md={5} lg={6} className='mb-3'>
                        <div className='d-flex align-items-center gap-2 flex-wrap'>
                          <Link
                            to={`/collections/${order.orderItems[0]?.category}/${order.orderItems[0].slug}`}
                          >
                            <Image
                              src={order.orderItems[0].images[0]}
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'contain',
                              }}
                            />
                          </Link>
                          <div>
                            <Link
                              to={`/collections/${order.orderItems[0]?.category}/${order.orderItems[0].slug}`}
                              className='mb-1 fs-5 text-black'
                            >
                              {order.orderItems[0].title.slice(0, 30) + '...'}
                            </Link>
                            <p className='fs-6 mb-1'>
                              {' '}
                              <span className='fw-bold me-1'>OrderId:{''}</span>
                              {order._id}
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={4} lg={4} className='mb-3'>
                        <div className=''>
                          <p className='fs-6 mb-1'>
                            <span className='fw-bold me-1'>
                              Payment status:
                            </span>{' '}
                            {order.isPaid ? 'Paid' : 'Not paid'}
                          </p>
                          <p className='fs-6 mb-1'>
                            <span className='fw-bold me-1'>Delivery:</span>{' '}
                            {order.isDelivered ? 'Delivered' : 'Not delivered'}
                          </p>
                        </div>
                      </Col>
                      <Col xs={12} md={3} lg={2} className='mb-3 text-center'>
                        <Link to={`/account/${username}/orders/${order._id}`}>
                          <Button
                            variant='danger'
                            className='rounded-0 fw-medium'
                          >
                            SEE DETAILS
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  ))}
                </>
              ) : (
                <h1 className='fs-6'>
                  Sorry, you have no orders. To see orders, start by purchasing
                  an item.
                </h1>
              )}
            </>
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </>
  )
}
