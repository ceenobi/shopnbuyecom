import { Button, Table } from 'react-bootstrap'
import { useStore } from '../../../hooks/store'
import useDataFetching from '../../../hooks/fetchData'
import { getAllOrders, trackOrders } from '../../../config/api'
import { formatCurrency } from '../../../utils/formatCurrency'
import { Link } from 'react-router-dom'
import Loader from '../../../utils/Loader'
import { useEffect } from 'react'

export default function Orders() {
  const { currentUser } = useStore()
  const {
    data: orders,
    error,
    loading,
    setData,
  } = useDataFetching(getAllOrders, currentUser?.access_token)

  useEffect(() => {
    document.title = `Shop orders`
  }, [])

  const handleUpdate = async (id) => {
    const item = orders.filter((order) => order._id === id)[0]
    const currentStatus = item.status

    try {
      const res = await trackOrders(
        id,
        { status: currentStatus + 1 },
        currentUser?.access_token
      )
      setData([res.data, ...orders.filter((order) => order._id !== id)])
    } catch (error) {
      console.log(error)
    }
  }

  {
    error && <p className='mt-5 fs-5'>{error.message}</p>
  }
  return (
    <>
      <h1 className='fs-5 fw-bold mb-4'>Total orders ({orders?.length})</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          {orders?.length > 0 ? (
            <Table striped bordered hover variant='light' responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th className='fw-medium'>OrderId</th>
                  <th className='fw-medium'>Customer</th>
                  <th className='fw-medium'>Total</th>
                  <th className='fw-medium'>Payment Mode</th>
                  <th className='fw-medium'>Payment Status</th>
                  <th className='fw-medium'>Order Status</th>
                  <th className='fw-medium'>Delivery</th>
                  <th className='fw-medium'>Action</th>
                </tr>
              </thead>
              {orders?.map((order, i) => (
                <tbody key={i}>
                  <tr>
                    <td>{i}</td>
                    <td>
                      <Link
                        to={`/account/${currentUser?.user?.username}/orders/${order._id}`}
                        className={
                          order.isDelivered
                            ? 'text-success fs-6'
                            : 'text-black fs-6'
                        }
                      >
                        {order._id}
                      </Link>
                    </td>
                    <td>{order.shippingDetails.fullname}</td>
                    <td>{formatCurrency(order.totalPrice)}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{order.isPaid ? 'Paid' : 'Not Paid'}</td>
                    <td>
                      {order.status === 0 || order.status === 1
                        ? 'Waiting'
                        : 'Fufilled'}
                    </td>
                    <td>{order.isDelivered ? 'DELIVERED' : 'Pending'}</td>
                    <td>
                      <Button
                        variant={
                          order.isDelivered === true ? 'success' : 'warning'
                        }
                        className='rounded-0 fw-bold'
                        onClick={() => handleUpdate(order._id)}
                        disabled={order.isDelivered === true}
                      >
                        {order.isDelivered === true ? 'COMPLETE' : 'UPDATE'}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          ) : (
            <h1 className='fs-6'>No customer orders yet.</h1>
          )}
        </>
      )}
    </>
  )
}
