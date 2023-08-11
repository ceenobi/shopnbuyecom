import { useEffect } from 'react'
import { Button, Col, Image, Row } from 'react-bootstrap'
import { Minus, Plus, Trash2 } from 'react-feather'
import { HeaderLayout, PageLayout } from '../components'
import Breadcrumbs from '../utils/Breadcrumbs'
import { useStore } from '../hooks/store'
import { Link, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'
import { toast } from 'react-hot-toast'

export default function ViewBag() {
  const navigate = useNavigate()
  const {
    bagItems,
    removeFromBag,
    increaseBagQuantity,
    decreaseBagQuantity,
    priceTotal,
    currentUser,
  } = useStore()

  useEffect(() => {
    document.title = 'Your Bag'
  }, [])

  return (
    <PageLayout>
      <Breadcrumbs />
      <HeaderLayout heading='Bag' />
      <div className='d-none d-md-block'>
        <Row className='align-items-center mb-0'>
          <Col md={5} className='mb-0'>
            <p className='fs-5 fw-bold'>Product</p>
          </Col>
          <Col md={2} className='mb-0'>
            <p className='fs-5 fw-bold'>Price</p>
          </Col>
          <Col md={3} className='mb-0'>
            <p className='fs-5 fw-bold'>Quantity</p>
          </Col>
          <Col md={2} className='mb-0'>
            <p className='fs-5 fw-bold'>Total</p>
          </Col>
        </Row>
        <hr style={{ border: '1px solid black' }} />
      </div>

      {bagItems.map((item) => (
        <div key={item._id}>
          <Row className='align-items-center'>
            <Col xs={8} md={5} className='mb-4'>
              <div className='d-flex gap-2'>
                <Link to={`/collections/${item.category}/${item.slug}`}>
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    key={item.id}
                    style={{ width: '100px', height: 'auto' }}
                  />
                </Link>
                <div>
                  <p className='fs-6 fw-bold mb-0'>{item.title}</p>
                  <span className='fs-6'>{item.brand}</span>
                </div>
              </div>
            </Col>
            <Col xs={4} md={2} className='mb-4'>
              <p className='fs-5'>{formatCurrency(item.price)}</p>
            </Col>
            <Col xs={8} md={3} className='mb-4'>
              <div className='d-flex gap-1 align-items-center qtyBox'>
                <div
                  className='d-flex gap-2 justify-content-between align-items-center border border-black bg-white rounded-1 p-2'
                  style={{ width: '100px' }}
                >
                  <Minus
                    style={{ cursor: 'pointer' }}
                    size='16px'
                    onClick={() => decreaseBagQuantity(item)}
                  />
                  <span className='fs-5 fw-medium'>{item.quantity}</span>
                  <Plus
                    style={{ cursor: 'pointer' }}
                    size='16px'
                    onClick={() => increaseBagQuantity(item)}
                  />
                </div>
                <Trash2
                  style={{ cursor: 'pointer' }}
                  size='16px'
                  onClick={() => removeFromBag(item._id)}
                  className='hideTrash'
                />
              </div>
            </Col>
            <Col xs={4} md={2} className='mb-2'>
              <p className='fs-5'>
                {formatCurrency(item.quantity * item.price)}
              </p>
            </Col>
          </Row>
          <hr style={{ border: '1px solid black' }} />
        </div>
      ))}
      <div className='d-flex justify-content-lg-end mt-4'>
        <div>
          <h1>
            <span className='fs-4'>Subtotal: </span>{' '}
            <span className='fw-bold'>{formatCurrency(priceTotal)}</span>
          </h1>
          <span className='fs-6 mb-4'>
            Taxes and shipping calculated at checkout
          </span>
          <div className='mt-3'>
            <Button
              variant='dark'
              className='rounded-0 fw-bold w-100'
              onClick={() => {
                currentUser
                  ? navigate('/checkout')
                  : toast.error('Please Sign in to continue')
              }}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
