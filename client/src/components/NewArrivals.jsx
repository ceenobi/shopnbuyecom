import { Col, Row } from 'react-bootstrap'
import { ArrowLeftCircle, ArrowRightCircle } from 'react-feather'
import useScroll from '../hooks/scrollbar'
import ProductCard from './ProductCard'

export default function NewArrivals({ data }) {
  const filterByNew = data?.filter((product) => product.condition === 'New')
  const { scroll, scrollRef } = useScroll()

  return (
    <div className='d-flex justify-content-between align-items-center gap-4 mb-2'>
      <Row className='justify-content-between align-items-center gy-4 w-100 mx-auto'>
        <Col md={3}>
          <h1 className='fw-bold'>NEW ARRIVALS</h1>
          <p className='small'>
            Make bold fashion choices with our latest shoes, bags and
            accessories
          </p>
          <a
            href='#'
            className='fs-6 fw-bold text-black text-decoration-underline mb-4'
          >
            SHOP NOW
          </a>
        </Col>
        <Col md={8}>
          <div className='d-flex position-relative'>
            <div
              className='d-flex gap-4 overflow-x-scroll overflow-y-hidden w-100 scrollbody'
              ref={scrollRef}
            >
              {filterByNew.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <ArrowLeftCircle
              className='position-absolute top-50 start-0 translate-middle text-black z-2'
              size='1.8rem'
              type='button'
              onClick={() => scroll('left')}
            />
            <ArrowRightCircle
              className='position-absolute top-50 start-100 translate-middle text-black z-2'
              size='1.8rem'
              type='button'
              onClick={() => scroll('right')}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}
