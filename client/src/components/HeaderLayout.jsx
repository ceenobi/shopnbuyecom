export default function HeaderLayout({ heading, text }) {
  return (
    <div className='py-3'>
      <h1 className='fw-bold fs-1 text-capitalize'>{heading}</h1>
      <p className='fs-6'>{text}</p>
    </div>
  )
}
