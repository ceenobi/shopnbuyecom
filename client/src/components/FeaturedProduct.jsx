import { useState } from 'react'
import { Button, Col, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ArrowLeftCircle, ArrowRightCircle } from 'react-feather'
import { formatCurrency } from '../utils/formatCurrency'
import { useStore } from '../hooks/store'

export default function FeaturedProduct({ data }) {
  const [current, setCurrent] = useState(0)
  const { increaseBagQuantity, setShow } = useStore()

  const length = data?.length

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1)
  }

  const addToBag = (item) => {
    increaseBagQuantity(item)
    setShow(true)
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center gap-4 mb-2'>
        <div className='w-50  h-0 border border-black' />
        <h1 className='text-center fs-3 text-uppercase fw-bold'>
          Featured Products
        </h1>
        <div className='w-50  h-0 border border-black' />
      </div>
      <Row className='justify-content-between align-items-center'>
        <Col md={6} lg={5}>
          <div className='mx-auto w-100 h-100 px-3'>
            {data.map((product, i) => (
              <div key={i}>
                {i === current && (
                  <>
                    {product?.images?.map((image, i) => (
                      <div
                        key={i}
                        className='position-relative w-100 h-100 px-3'
                      >
                        {i === current && (
                          <>
                            <Link
                              to={`/collections/${product.category}/${product.slug}`}
                            >
                              <Image
                                src={image}
                                alt='imgpic'
                                style={{
                                  width: '100%',
                                  height: '400px',
                                  objectFit: 'contain',
                                  position: 'relative',
                                }}
                              />
                            </Link>
                            <ArrowLeftCircle
                              className='position-absolute top-50 start-0 translate-middle text-black z-2'
                              size='1.8rem'
                              style={{ cursor: 'pointer' }}
                              onClick={prevSlide}
                            />
                            <ArrowRightCircle
                              className='position-absolute top-50 start-100 translate-middle text-black z-2'
                              size='1.8rem'
                              style={{ cursor: 'pointer' }}
                              onClick={nextSlide}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </Col>
        <Col md={5} className='text-center text-md-start '>
          {data.map((product, i) => (
            <div key={i}>
              {i === current && (
                <>
                  <Link
                    to={`/collections/${product.category}/${product.slug}`}
                    className='fw-bold text-black'
                  >
                    {product.title}
                  </Link>
                  <h1 className='fs-4'>{formatCurrency(product.price)}</h1>
                  <Button
                    variant='dark rounded-0'
                    onClick={() => addToBag(product)}
                  >
                    ADD TO BAG
                  </Button>
                </>
              )}
            </div>
          ))}
        </Col>
      </Row>
    </>
  )
}
