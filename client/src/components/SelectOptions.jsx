import { Button } from "react-bootstrap";

export default function SelectOptions({
  setSortState,
  minPriceRange,
  setMinPriceRange,
  maxPriceRange,
  setMaxPriceRange,
  flattenBrands,
  brands,
  setBrands,
}) {
  return (
    <div className='d-flex gap-4 flex-wrap align-items-center'>
      <select
        defaultValue={'sort'}
        onChange={(e) => setSortState(e.target.value)}
        className='p-2'
      >
        <option value='sort'>Sort</option>
        <option value='asc'>A - Z</option>
        <option value='desc'>Z - A</option>
        <option value='low'>Price: L - H</option>
        <option value='high'>Price: H - L</option>
      </select>
      <div className='d-flex align-items-center gap-2'>
        <span className='fs-6 mb-0'>Price</span>
        <div className='d-flex align-items-center gap-2'>
          <input
            className='border p-2'
            type='text'
            value={minPriceRange}
            onChange={(e) => setMinPriceRange(e.target.value)}
            style={{ width: '80px' }}
          />
          <span>-</span>
          <input
            className='border p-2'
            type='text'
            value={maxPriceRange}
            onChange={(e) => setMaxPriceRange(e.target.value)}
            style={{ width: '80px' }}
          />
        </div>
      </div>
      <div className='d-flex flex-wrap overflow-x-scroll overflow-y-hidden scrollbody align-items-center'>
        {flattenBrands?.map((brand, i) => (
          <Button
            variant='none'
            key={i}
            className={
              brands === brand
                ? 'rounded-4 bg-dark px-3 py-1 text-white me-2 mb-3 mb-md-0'
                : 'p-2 bg-secondary-subtle rounded-2 me-2 mb-3 mb-md-0'
            }
            onClick={() => setBrands(brand)}
          >
            {brand}
          </Button>
        ))}
      </div>
    </div>
  )
}
