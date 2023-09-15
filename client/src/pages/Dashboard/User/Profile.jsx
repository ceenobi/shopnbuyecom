import { useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import useDataFetching from '../../../hooks/fetchData'
import { useStore } from '../../../hooks/store'
import { getUserProfile } from '../../../config/api'
import { Image, Row, Col } from 'react-bootstrap'
import { format } from 'timeago.js'
import Loader from '../../../utils/Loader'
import { UpdateProfile } from '../../../components'

export default function Profile() {
  const { currentUser } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const { username } = useParams()
  const { error, data, loading } = useDataFetching(
    getUserProfile,
    username,
    currentUser?.access_token
  )

  useEffect(() => {
    document.title = `${data?.username} profile`
    if (location.pathname === `/account/user-profile`) {
      navigate(`/account/user-profile/${currentUser?.user?.username}`)
    }
  }, [currentUser?.user?.username, data?.username, location.pathname, navigate])

  {
    error && <p className='mt-5 fs-5'>{error.message}</p>
  }

  return (
    <>
      {loading && <Loader />}
      <Row className='align-items-center justify-content-around gy-2'>
        <Col md={12} className='text-center mb-4'>
          <Image
            src={data?.profileImg}
            className='rounded-circle mb-4 object-fit-cover shadow'
            style={{ width: '100px', height: '100px' }}
          />
          <h1 className='fs-5 fw-bold'>{data?.username}</h1>
          <p className='fs-5 mb-1'>Email: {data?.email}</p>
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
