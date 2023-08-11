import { Row, Col } from 'react-bootstrap'
import { HeaderLayout, PageLayout } from '../../components'
import { useStore } from '../../hooks/store'
import Breadcrumbs from '../../utils/Breadcrumbs'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Account() {
  const { currentUser, links, adminLinks } = useStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `${currentUser?.user?.username} account`
    if (location.pathname === '/account') {
      navigate(`/account/${currentUser?.user?.username}/orders`)
    }
  }, [currentUser?.user?.username, location.pathname, navigate])

  return (
    <PageLayout>
      <Breadcrumbs />
      <HeaderLayout heading={`Welcome, ${currentUser?.user?.username}`} />

      <Row
        className='mx-auto position-relative border border-3 rounded-3'
        style={{ minHeight: '700px' }}
      >
        <Col
          lg={3}
          className='bg-white p-3 d-none d-lg-block border position-absolute top-0 h-100'
        >
          {links.map((item, i) => (
            <span key={i} className='mb-3 d-flex align-items-center gap-3'>
              <div>{item.icon}</div>
              <NavLink
                to={`${item.path}`}
                className={({ isActive }) =>
                  isActive ? 'text-success fw-bold' : 'text-black fw-medium'
                }
              >
                {item.name}
              </NavLink>
            </span>
          ))}
          <hr />
          {currentUser?.user?.isAdmin === true && (
            <>
              {adminLinks.map((item, i) => (
                <div key={i} className='mb-3 d-flex align-items-center gap-3'>
                  <div>{item.icon}</div>
                  <NavLink
                    to={`${item.path}`}
                    className={({ isActive }) =>
                      isActive ? 'text-success fw-bold' : 'text-black fw-medium'
                    }
                  >
                    {item.name}
                  </NavLink>
                </div>
              ))}
            </>
          )}
        </Col>
        <Col lg={9} className='bg-light border p-3 ms-auto scrollbody'>
          <Outlet />
        </Col>
      </Row>
    </PageLayout>
  )
}