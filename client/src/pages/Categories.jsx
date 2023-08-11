import { useEffect, useState } from 'react'
import useDataFetching from '../hooks/fetchData'
import { getPoductsByCat } from '../config/api'
import { useParams } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import {
  HeaderLayout,
  PageLayout,
  ProductCard,
  SelectOptions,
} from '../components'
import Loader from '../utils/Loader'
import Breadcrumbs from '../utils/Breadcrumbs'
import { useStore } from '../hooks/store'

export default function Categories() {
  const [sortState, setSortState] = useState('sort')
  const [brands, setBrands] = useState('')
  const [minPriceRange, setMinPriceRange] = useState(43)
  const [maxPriceRange, setMaxPriceRange] = useState(3680)
  const { collectionId } = useParams()
  const { data, error, loading } = useDataFetching(
    getPoductsByCat,
    collectionId
  )
  const { sortMethods } = useStore()

  useEffect(() => {
    document.title = collectionId
  }, [collectionId])

  const getBrands = data?.flatMap((product) => product.brand)
  const filterBrands = [
    getBrands?.filter((item, i) => {
      return getBrands.indexOf(item) === i
    }),
  ]
  const flattenBrands = filterBrands.flatMap((product) => product)
  const filterProductsByBrands = data?.filter(
    (product) => product.brand === brands
  )

  const filterPrices = data?.filter(
    (product) =>
      product.price >= minPriceRange && product.price <= maxPriceRange
  )

  const filteredData =
    brands !== ''
      ? filterProductsByBrands
      : data || brands !== ' '
      ? filterPrices
      : data

  return (
    <PageLayout>
      <Breadcrumbs />
      {error && <p className='fs-5'>{error.message}</p>}
      <HeaderLayout
        heading={collectionId}
        text={`Browse our latest collection of ${collectionId} items sourced just for you. You'll be sure to find a classic.`}
      />
      {loading && <Loader />}
      <SelectOptions
        setSortState={setSortState}
        minPriceRange={minPriceRange}
        setMinPriceRange={setMinPriceRange}
        maxPriceRange={maxPriceRange}
        setMaxPriceRange={setMaxPriceRange}
        flattenBrands={flattenBrands}
        brands={brands}
        setBrands={setBrands}
      />
      {data?.length && (
        <Row className='mt-4 gy-3'>
          {filteredData?.sort(sortMethods[sortState]?.method).map((product) => (
            <Col key={product._id} xs={6} md={4}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </PageLayout>
  )
}
