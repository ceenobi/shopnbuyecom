import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useDataFetching from '../../../hooks/fetchData'
import { useStore } from '../../../hooks/store'
import { getUserProfile } from '../../../config/api'
import { Image, Row, Col } from 'react-bootstrap'
import { format } from 'timeago.js'
import Loader from '../../../utils/Loader'
import { UpdateProfile } from '../../../components'

export default function Profile() {
  const { currentUser } = useStore()
  const { username } = useParams()
  const { error, data, loading } = useDataFetching(
    getUserProfile,
    username,
    currentUser?.access_token
  )

  useEffect(() => {
    document.title = `${data?.username} profile`
  }, [data?.username])

  {
    error && <p className='mt-5 fs-5'>{error.message}</p>
  }

  return (
    <>
      {loading && <Loader />}
      <Row className='align-items-center justify-content-around gy-2'>
        <Col md={5} lg={5} className='text-center text-lg-start mb-4'>
          <Image
            src={data?.profileImg}
            className='rounded-circle mb-4 object-fit-cover'
            style={{ width: '100px', height: '100px' }}
          />
          <h1 className='fs-5 fw-bold'>{data?.username}</h1>
          <p className='fs-5 mb-1'>{data?.email}</p>
          <p className='fs-5'>
            <span>Date registered: </span>
            {format(data?.createdAt)}
          </p>
        </Col>
        <Col md={6} lg={5}>
          <UpdateProfile />
        </Col>
      </Row>
    </>
  )
}
