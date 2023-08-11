import { Link } from 'react-router-dom'
import useDataFetching from '../hooks/fetchData'
import { getFeaturedPoducts, getNewOrPreorder } from '../config/api'
import Loader from '../utils/Loader'
import { FeaturedProduct, NewArrivals, Preorder } from '../components'
import { useEffect } from 'react'

export default function Home() {
  const { data, error, loading } = useDataFetching(getFeaturedPoducts)
  const { data: newArrivals } = useDataFetching(getNewOrPreorder)

  useEffect(() => {
    document.title = `Home`
  }, [])

  if (error) return <p>{error.message}</p>

  return (
    <section className='py-5'>
      <div className='banner'>
        <div className='layout-container d-flex flex-column justify-content-center align-items-center h-100'>
          <p className='text-uppercase fw-medium'>New season</p>
          <h1 className='fs-1 fw-bold'>The Summer Edit</h1>
          <p className='text-center fs-5 fw-bold mb-4'>
            Joyful products here to get you <br />
            spending. Hurry now!
          </p>
          <Link
            to='/collections'
            className='small text-decoration-underline text-black fw-medium'
          >
            CONTINUE BROWSING
          </Link>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {data?.length && (
            <div className='layout-container mt-3 py-5 px-3'>
              <FeaturedProduct data={data} />
            </div>
          )}
          {newArrivals?.length && (
            <div className='layout-container mt-3 py-5 px-3'>
              <NewArrivals data={newArrivals} />
            </div>
          )}
          <div className='bannerB my-4 d-flex justify-content-center align-items-center'>
            <div className='layout-container w-100 text-white text-center px-4'>
              <h1 className='fs-1 fw-bold'>SHOP N BUY</h1>
              <p className='fs-3'>Your one stop shop for all things</p>
            </div>
          </div>
          {newArrivals?.length && (
            <div className='layout-container mt-3 py-5 px-3'>
              <Preorder data={newArrivals} />
            </div>
          )}
        </>
      )}
    </section>
  )
}
