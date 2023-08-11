import { useEffect, useState } from 'react'
import { PageLayout, ProductCard, SelectOptions } from '../components'
import { searchProduct } from '../config/api'
import { useNavigate } from 'react-router-dom'
import Loader from '../utils/Loader'
import { Col, Row } from 'react-bootstrap'
import { useStore } from '../hooks/store'
import Breadcrumbs from '../utils/Breadcrumbs'

export default function Search() {
  const query = new URLSearchParams(location.search)
  const queryParams = query.get('q')
  const [result, setResult] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState('')
  const [sortState, setSortState] = useState('sort')
  const { sortMethods } = useStore()

  const [minPriceRange, setMinPriceRange] = useState(43)
  const [maxPriceRange, setMaxPriceRange] = useState(3680)
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  const filterPrices = result?.filter(
    (product) =>
      product.price >= minPriceRange && product.price <= maxPriceRange
  )
  const getBrands = result?.flatMap((product) => product.brand)
  const filterBrands = [
    'All',
    getBrands?.filter((item, i) => {
      return getBrands.indexOf(item) === i
    }),
  ]
  const flattenBrands = filterBrands.flatMap((product) => product)
  const filterProductsByBrands = result?.filter(
    (product) => product.brand === brands
  )

  const filteredResult = brands
    ? filterProductsByBrands
    : result || brands
    ? filterPrices
    : result && brands !== 'All'
    ? result
    : null

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const searchRequest = async () => {
        document.title = `Search result for "${queryParams}"`
        setLoading(true)
        searchProduct(queryParams)
          .then((res) => {
            setResult(res.data)
          })
          .catch((error) => {
            console.error(error)
            setError(error)
          })
          .finally(() => {
            setLoading(false)
          })
      }
      searchRequest()
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [queryParams])

  useEffect(() => {
    const params = new URLSearchParams()
    if (queryParams) {
      params.append('q', queryParams)
    } else {
      params.delete('q')
    }
    navigate({ search: params.toString() })
  }, [queryParams, navigate])

  useEffect(() => {
    if (filteredResult) {
      setIndex(filteredResult.length)
    }
  }, [filteredResult])

  return (
    <PageLayout>
      <Breadcrumbs />
      {error && <p className='fs-5'>{error.message}</p>}

      <div className='d-flex flex-wrap align-items-center justify-content-between mt-4 mb-4'>
        <span className='fw-bold fs-4'>Products ({index})</span>
        <span className='fs-6 align-baseline'>
          showing {index} result(s) for &quot;
          <b>{queryParams}</b>&quot;
        </span>
      </div>
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
      {loading ? (
        <Loader />
      ) : (
        <Row className='gy-4 mt-4'>
          {filteredResult?.length > 0 ? (
            <>
              {filteredResult
                ?.sort(sortMethods[sortState]?.method)
                .map((product) => (
                  <Col key={product._id} xs={6} md={4}>
                    <ProductCard product={product} />
                  </Col>
                ))}
            </>
          ) : (
            <p className='text-center fs-5'>
              We could not find anything that match your search
            </p>
          )}
        </Row>
      )}
    </PageLayout>
  )
}
