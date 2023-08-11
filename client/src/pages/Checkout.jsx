import { useEffect, useState } from 'react'
import { HeaderLayout, PageLayout, Paypal } from '../components'
import Breadcrumbs from '../utils/Breadcrumbs'
import { Button, Col, Row, Spinner } from 'react-bootstrap'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import registerOptions from '../utils/formValidate'
import { useStore } from '../hooks/store'
import { formatCurrency } from '../utils/formatCurrency'
import { createOrder } from '../config/api'

export default function Checkout() {
  const [next, setNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    setShippingDetails,
    shippingDetails,
    currentUser,
    setPaymentMethod,
    paymentMethod,
    bagItems,
    setBagItems,
    priceTotal,
  } = useStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: shippingDetails.fullname || '',
      shippingAddress: shippingDetails.shippingAddress || '',
      phone: shippingDetails.phone || '',
      state: shippingDetails.state || '',
    },
  })

  useEffect(() => {
    document.title = 'Checkout'
  }, [])

  const paymentOptions = [{ name: 'Cash' }, { name: 'Paypal' }]

  const tax = 0.05
  const calcTax = (tax * priceTotal).toFixed(2)
  const calcShippingFee = (priceTotal / 2) * tax
  const shippingFee = priceTotal > 3000 ? 0 : calcShippingFee.toFixed(2)
  const total = (
    Number(priceTotal) +
    Number(calcTax) +
    Number(shippingFee)
  ).toFixed(2)

  const order = {
    orderItems: bagItems,
    shippingDetails: shippingDetails,
    paymentMethod: paymentMethod,
    taxPrice: calcTax,
    shippingPrice: shippingFee,
    totalPrice: total,
  }

  const placeOrder = async () => {
    setLoading(true)
    try {
      const res = await createOrder(order, currentUser?.access_token)
      if (res.status === 201) {
        toast.success('Order successfull')
        setBagItems([])
        navigate(
          `/account/${
            currentUser?.user?.isAdmin === true ? 'admin' : 'customer'
          }/orders`
        )
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data, e) => {
    e.preventDefault()
    setShippingDetails(data)
    next ? null : setNext((prev) => !prev)
  }

  return (
    <PageLayout>
      <Breadcrumbs />
      <HeaderLayout heading='Checkout' />
      {bagItems?.length > 0 ? (
        <Row className='justify-content-between'>
          <Col md={6} lg={5} className='mb-4'>
            <h1 className='fs-4'>Order summary</h1>
            {bagItems?.map((item) => (
              <Row key={item._id} className='border py-2'>
                <Col md={6}>
                  <p className='text-dark mb-0 fs-6'>{item.title}</p>
                </Col>
                <Col md={2}>
                  <p className='text-dark mb-0 fs-6'>Qty: {item.quantity}</p>
                </Col>
                <Col md={4}>
                  <p className='text-dark mb-0 fs-6'>
                    Price: {formatCurrency(item.price)}
                  </p>
                </Col>
              </Row>
            ))}
            <div className='mt-4'>
              <div className='d-flex justify-content-between mb-2'>
                <p className='text-dark mb-0 fs-6'>subTotal</p>
                <p className='text-dark mb-0 fs-6'>
                  {formatCurrency(priceTotal)}
                </p>
              </div>
              <div className='d-flex justify-content-between mb-2'>
                <p className='text-dark mb-0 fs-6'>Tax</p>
                <p className='text-success mb-0 fs-6'>fixed 0.05</p>
                <p className='text-dark mb-0 fs-6'>{formatCurrency(calcTax)}</p>
              </div>
              <div className='d-flex justify-content-between mb-2'>
                <p className='text-dark mb-0 fs-6'>ShippingFee</p>
                <p className='text-dark mb-0 fs-6'>
                  {formatCurrency(shippingFee)}
                </p>
              </div>
              <div className='d-flex justify-content-between'>
                <p className='text-dark mb-0 fs-6'>Total</p>
                <p className='text-dark mb-0 fs-6 fw-bold'>
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </Col>
          <Col md={6} lg={5}>
            <h1 className='fs-4'>
              {next ? 'Shipping data' : 'Shipping details'}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              {!next ? (
                <>
                  <div className='mb-3 inputRegBox '>
                    <input
                      type='text'
                      placeholder='Fullname'
                      id='fullname'
                      className='w-100 inputReg mb-0'
                      autoFocus
                      {...register(`fullname`, registerOptions.fullname)}
                    />
                    {errors?.fullname?.message && (
                      <p className='text-danger fs-6'>
                        {errors.fullname.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-3 inputRegBox '>
                    <input
                      type='text'
                      placeholder='Address'
                      id='address'
                      className='w-100 inputReg mb-0'
                      {...register(
                        `shippingAddress`,
                        registerOptions.shippingAddress
                      )}
                    />
                    {errors?.shippingAddress?.message && (
                      <p className='text-danger fs-6'>
                        {errors.shippingAddress.message}
                      </p>
                    )}
                  </div>
                  <div className='mb-3 inputRegBox '>
                    <input
                      type='text'
                      placeholder='Phone'
                      id='phone'
                      className='w-100 inputReg mb-0'
                      {...register(`phone`, registerOptions.phone)}
                    />
                    {errors?.phone?.message && (
                      <p className='text-danger fs-6'>{errors.phone.message}</p>
                    )}
                  </div>
                  <div className='mb-3 inputRegBox '>
                    <input
                      type='text'
                      placeholder='State'
                      id='state'
                      className='w-100 inputReg mb-0'
                      {...register(`state`, registerOptions.state)}
                    />
                    {errors?.state?.message && (
                      <p className='text-danger fs-6'>{errors.state.message}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className='mb-1 fs-5'>{shippingDetails.fullname}</p>
                  <p className='mb-1 fs-5'>{shippingDetails.shippingAddress}</p>
                  <p className='mb-1 fs-5'>{shippingDetails.phone}</p>
                  <p className='mb-1 fs-5'>{shippingDetails.state}</p>
                  <hr />
                  <h1 className='fs-5 mt-4'>Select payment method</h1>
                  {paymentOptions.map((item, i) => (
                    <div className='form-check' key={i}>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='paymentmethod'
                        id={i}
                        value={item.name}
                        defaultChecked={item.name === paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className='form-check-label' htmlFor={i}>
                        {item.name}
                      </label>
                    </div>
                  ))}
                </>
              )}
              <div className='d-flex justify-content-between align-items-center mt-3'>
                {next && (
                  <Button
                    variant={next ? 'warning' : 'dark'}
                    className='mt-2 fw-medium'
                    onClick={() => setNext(!next)}
                  >
                    Back
                  </Button>
                )}
                {!next && (
                  <Button
                    type='submit'
                    variant={next ? 'warning' : 'dark'}
                    className='mt-2 fw-medium'
                  >
                    Continue
                  </Button>
                )}

                {next && (
                  <>
                    {paymentMethod === 'Paypal' ? (
                      <Paypal total={total} placeOrder={placeOrder} />
                    ) : (
                      <Button
                        variant={next ? 'success' : 'warning'}
                        type='submit'
                        className='mt-2 fw-bold'
                        onClick={placeOrder}
                      >
                        {loading ? (
                          <Spinner animation='border' size='sm' />
                        ) : (
                          'Placeorder'
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </form>
          </Col>
        </Row>
      ) : (
        <div>
          <h1 className='fs-4 text-center'>
            You have no orders to proceed. Please add a few items to your bag
          </h1>
        </div>
      )}
    </PageLayout>
  )
}
