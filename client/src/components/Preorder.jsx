import ProductCard from './ProductCard'

export default function Preorder({ data }) {
  const filterByPreorder = data?.filter(
    (product) => product.condition === 'Preorder'
  )
  return (
    <>
      <div className='d-flex flex-column justify-content-center mb-4'>
        <h1 className='fw-bold text-center'>PREORDER</h1>
        <a
          href='#'
          className='text-secondary fs-6 fw-bold text-center text-decoration-'
        >
          VIEW ALL
        </a>
      </div>
      <div className='d-flex overflow-x-scroll overflow-y-hidden gap-4 scrollbody'>
        {filterByPreorder.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </>
  )
}
