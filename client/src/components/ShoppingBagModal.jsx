import { Button, Badge, Offcanvas, Image } from 'react-bootstrap'
import { ShoppingBag, Minus, Plus, Trash2 } from 'react-feather'
import { useStore } from '../hooks/store'
import { Link, useLocation } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'
import { toast } from 'react-hot-toast'

export default function ShoppingBagModal() {
  const {
    show,
    setShow,
    bagQuantity,
    bagItems,
    removeFromBag,
    increaseBagQuantity,
    decreaseBagQuantity,
    priceTotal,
    currentUser,
  } = useStore()
  const location = useLocation()
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <div
        className='position-relative'
        onClick={location.pathname === '/bag' ? null : handleShow}
      >
        <ShoppingBag color='black' type='button' />
        <h6 className='position-absolute top-0 start-100 translate-middle fs-6'>
          <Badge pill bg='dark'>
            {bagQuantity > 0 ? bagQuantity : 0}
          </Badge>
        </h6>
      </div>
      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <h1 className='fs-2 fw-bold text-black'>BAG</h1>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='position-relative'>
            {bagItems.length > 0 ? (
              <div
                style={{ height: '70vh', overflow: 'scroll' }}
                className='scrollbody'
              >
                {bagItems.map((item) => (
                  <div key={item._id}>
                    <div className='d-flex align-items-center gap-4 mb-4 w-100'>
                      <Link
                        to={`/collections/${item.category}/${item.slug}`}
                        onClick={handleClose}
                      >
                        <Image
                          src={item?.images[0]}
                          alt={item.title}
                          style={{ width: '100px', height: 'auto' }}
                        />
                      </Link>
                      <div className='d-flex flex-column flex-grow-1 justify-content-between'>
                        <p className='fs-6 fw-bold mb-0'>{item.title}</p>
                        <span className='fs-6'>{item.brand}</span>
                        <div className='d-flex justify-content-between align-items-center qtyBox'>
                          <div className='d-flex gap-2 align-items-center border border-black bg-white rounded-1 p-2'>
                            <Minus
                              type='button'
                              size='16px'
                              onClick={() => decreaseBagQuantity(item)}
                            />
                            <span className='fs-5 fw-medium'>
                              {item.quantity}
                            </span>
                            <Plus
                              type='button'
                              size='16px'
                              onClick={() => increaseBagQuantity(item)}
                            />
                          </div>
                          <span className='fs-5'>
                            {formatCurrency(item.price)}
                          </span>
                          <Trash2
                            type='button'
                            size='16px'
                            onClick={() => removeFromBag(item._id)}
                            className='hideTrash'
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            ) : (
              <h1
                className='text-center fs-4 mt-4'
                style={{ height: '65vh', overflow: 'scroll' }}
              >
                Your bag is empty 😭{' '}
              </h1>
            )}
            <div className=' w-100'>
              <h1>
                <span className='fs-4'>Subtotal: </span>{' '}
                <span className='fw-bold'>{formatCurrency(priceTotal)}</span>
              </h1>
              <span className='fs-6 mb-4'>
                Taxes and shipping calculated at checkout
              </span>
              <div>
                <Button
                  variant='dark'
                  className='rounded-0 w-100 mb-3 fw-bold'
                  as={Link}
                  to='/checkout'
                  onClick={() => {
                    handleClose()
                    {
                      !currentUser &&
                        toast.error('Sign in to continue to checkout')
                    }
                  }}
                >
                  Checkout
                </Button>
                <Button
                  variant='outline-dark'
                  className='rounded-0 w-100 fw-bold'
                  as={Link}
                  to={'/bag'}
                  onClick={handleClose}
                >
                  View Bag
                </Button>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}
