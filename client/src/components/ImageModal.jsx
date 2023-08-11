import { Image, Modal } from 'react-bootstrap'
import { ArrowLeftCircle, ArrowRightCircle, X } from 'react-feather'

export default function ImageModal({
  showPicModal,
  setShowPicModal,
  data,
  current,
  setCurrent,
}) {
  const handleClose = () => setShowPicModal(false)

  const imgSlide = data?.images?.map((image) => image)

  const nextSlide = () => {
    setCurrent(current === imgSlide.length - 1 ? 0 : current + 1)
  }

  const prevSlide = () => {
    setCurrent(current === 0 ? imgSlide.length - 1 : current - 1)
  }

  return (
    <>
      <Modal
        show={showPicModal}
        onHide={handleClose}
        fullscreen={true}
        backdrop='static'
      >
        <Modal.Body>
          <div className='text-end w-100'>
            <X type='button' size='30px' onClick={handleClose} />
          </div>
          <div className='position-relative w-100 h-100'>
            <Image
              src={imgSlide[current]}
              alt='imgpic'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'relative',
              }}
            />
            <ArrowLeftCircle
              className='position-absolute top-50 start-0 translate-middle text-black z-2'
              size='1.8rem'
              type='button'
              onClick={prevSlide}
            />
            <ArrowRightCircle
              className='position-absolute top-50 start-100 translate-middle text-black z-2'
              size='1.8rem'
              type='button'
              onClick={nextSlide}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
