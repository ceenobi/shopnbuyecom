import { useEffect } from 'react'
import { Col, Image, Row } from 'react-bootstrap'
import { HeaderLayout, PageLayout } from '../components'
import { getCategories } from '../config/api'
import useDataFetching from '../hooks/fetchData'
import Loader from '../utils/Loader'
import { Link, useLocation, Outlet } from 'react-router-dom'
import Breadcrumbs from '../utils/Breadcrumbs'

export default function Collections() {
  const { data, error, loading } = useDataFetching(getCategories)
  const location = useLocation()

  useEffect(() => {
    document.title = 'Collections'
  }, [])

  return (
    <>
      {location.pathname === '/collections' ? (
        <PageLayout>
          <Breadcrumbs />
          <HeaderLayout heading='Collections' />
          {error && <p className='fs-5'>{error.message}</p>}
          {loading && <Loader />}
          <Row className='gy-3'>
            {data.map((cat) => (
              <Col md={4} key={cat._id}>
                <Link to={`/collections/${cat.name}`} className='collection'>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    title={cat.name}
                    className='img-fluid'
                    loading='lazy'
                  />
                  <p className='fw-bold text-black py-3 px-2 bg-secondary-subtle'>
                    {cat.name}
                  </p>
                </Link>
              </Col>
            ))}
          </Row>
        </PageLayout>
      ) : (
        <Outlet />
      )}
    </>
  )
}
