import { Gitlab } from 'react-feather'

export default function Footer() {
  return (
    <div className='layout-container mt-5 p-3'>
      <div className='border-0 border-top border-dark mb-3' />
      <div className='d-flex justify-content-between align-items-center'>
        <span>© 2023 ShopNBuy™. All Rights Reserved.</span>
        <a href='#' target='_blank'>
          <Gitlab color='black' />
        </a>
      </div>
    </div>
  )
}
