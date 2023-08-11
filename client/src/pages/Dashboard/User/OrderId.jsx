import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useStore } from '../../../hooks/store'
import useDataFetching from '../../../hooks/fetchData'
import { getOrderDetail } from '../../../config/api'
import { Col, Row, Image } from 'react-bootstrap'
import { format } from 'timeago.js'
import { formatCurrency } from '../../../utils/formatCurrency'
import Loader from '../../../utils/Loader'

export default function OrderId() {
  const { id } = useParams()
  const [isPay, setNoPay] = useState('')
  const { currentUser } = useStore()
  const {
    data: orderId,
    error,
    loading,
  } = useDataFetching(getOrderDetail, id, currentUser?.access_token)

  useEffect(() => {
    document.title = `Your order ${orderId?._id}`
  }, [orderId?._id])

  const track = orderId?.status

  useEffect(() => {
    track === 0 ? setNoPay('Preparing') : ''
    track === 1 ? setNoPay('On the way') : ''
    track === 2 ? setNoPay('Delivered') : ''
  }, [track])

  {
    error && <p className='mt-5 fs-5'>{error.message}</p>
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Row>
          <Col md={4} className='mb-3'>
            <div className='mb-3'>
              <p className='fs-6'>
                <span className='fw-bold fs-5'>Order id: </span> {id}
              </p>

              <p className='fs-5 mb-0'>
                <span className='fw-medium'>Quantity: </span>
                {orderId?.orderItems?.length}item(s)
              </p>

              <p className='fs-6'>Placed order {format(orderId?.createdAt)}</p>
            </div>
          </Col>
          <Col md={5} className='mb-3'>
            <div>
              <p className='mb-1 fs-5 fw-bold'>Product</p>
              {orderId?.orderItems?.map((order) => (
                <div
                  className='d-flex flex-wrap align-items-center gap-2 mb-2'
                  key={order._id}
                >
                  <Image
                    src={order.images[0]}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'contain',
                    }}
                  />
                  <div>
                    <span className='mb-1 fs-6'>
                      {order.title?.length > 40
                        ? order.title.slice(0, 40) + '...'
                        : order.title}
                    </span>
                    <br />
                    <span className='fs-6'>{formatCurrency(order.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col md={3} className='mb-3'>
            <div className='mb-2'>
              <p className='mb-1 fs-5 fw-bold'>Payment status</p>
              {orderId?.isPaid ? (
                <p className='fs-6 mb-0'>Paid {orderId?.paidAt}</p>
              ) : (
                <p className='fs-6 mb-0'>Not paid</p>
              )}
            </div>
            <div>
              <p className='mb-1 fs-5 fw-bold'>Delivery status</p>
              {orderId?.isDelivered ? (
                <p className='fs-6 mb-0'>Delivered {orderId?.deliveredAt}</p>
              ) : (
                <p className='fs-6 mb-0'>{isPay}</p>
              )}
            </div>
          </Col>
          <hr />
          <Col md={6} className='mb-3'>
            <div>
              <h1 className='fs-6 fw-bold'>PAYMENT INFORMATION</h1>
              <p className='mb-1 fs-5 fw-medium'>Payment Method</p>
              <p className='fs-6'>Mode: {orderId?.paymentMethod}</p>
              <p className='fs-5 mb-1 fw-medium'>Payment Details</p>
              {orderId?.orderItems?.map((order) => (
                <p key={order._id} className='fs-6 mb-1'>
                  Item price: {formatCurrency(order?.price)}
                </p>
              ))}
              <p className='fs-6 mb-1'>
                Tax: {formatCurrency(orderId?.taxPrice)}
              </p>
              <p className='fs-6 mb-1'>
                Delivery fee: {formatCurrency(orderId?.shippingPrice)}
              </p>
              <p className='fs-6 fw-bold'>
                Total: {formatCurrency(orderId?.totalPrice)}
              </p>
            </div>
          </Col>
          <Col md={6} className='mb-3'>
            <div>
              <h1 className='fs-6 fw-bold'>DELIVERY INFORMATION</h1>
              <p className='mb-1 fs-5 fw-medium'>Shipping Details</p>
              <p className='fs-6 mb-1'>{orderId?.shippingDetails?.address}</p>
              <p className='fs-6 mb-1'>
                Receiver: {orderId?.shippingDetails?.fullname}
              </p>
              <p className='fs-6 mb-1'>
                Phone: {orderId?.shippingDetails?.phone}
              </p>
              <p className='fs-6'>
                Location: {orderId?.shippingDetails?.state}
              </p>
              <p className='mb-1 fs-5 fw-bold'>Buyer Details</p>
              <p className='fs-6 text-capitalize mb-1'>
                Name: {orderId?.user?.username}
              </p>
              <p className='fs-6'>Email: {orderId?.user?.email}</p>
            </div>
          </Col>
        </Row>
      )}
    </>
  )
}
