import { Menu, Power } from 'react-feather'
import { useState } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { NavLink } from 'react-router-dom'
import useDataFetching from '../hooks/fetchData'
import { getCategories } from '../config/api'
import Loader from '../utils/Loader'
import { useStore } from '../hooks/store'

export default function Sidebar() {
  const [show, setShow] = useState(false)
  const { data, error, loading } = useDataFetching(getCategories)
  const { currentUser, links, adminLinks, LogOut } = useStore()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div className='d-lg-none me-2'>
      <Menu size='30px' onClick={handleShow} style={{cursor:'pointer'}}/>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <NavLink to='/' className='fs-2 fw-bold text-black'>
              SHOP N BUY
            </NavLink>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <hr />
            <h1 className='mb-2 fs-3 fw-bold'>Categories</h1>
            {error && <p>{error.message}</p>}
            {loading ? (
              <Loader />
            ) : (
              <>
                {data?.map((category) => (
                  <div key={category._id} className='mb-3'>
                    <NavLink
                      to={`/collections/${category.name}`}
                      className={({ isActive }) =>
                        isActive
                          ? 'text-success fw-bold'
                          : 'text-black fw-medium'
                      }
                      onClick={handleClose}
                    >
                      {category.name}
                    </NavLink>
                  </div>
                ))}
              </>
            )}
          </div>
          {currentUser && (
            <>
              <hr />
              <h1 className='fs-3 fw-bold '>Account</h1>
              {links.map((item, i) => (
                <div key={i} className='mb-3'>
                  <NavLink
                    to={`account/${item.path}`}
                    className={({ isActive }) =>
                      isActive ? 'text-success fw-bold' : 'text-black fw-medium'
                    }
                    onClick={handleClose}
                  >
                    {item.name}
                  </NavLink>
                </div>
              ))}
              {currentUser?.user?.isAdmin === true && (
                <>
                  {adminLinks.map((item, i) => (
                    <div key={i} className='mb-3'>
                      <NavLink
                        to={`account/${item.path}`}
                        className={({ isActive }) =>
                          isActive
                            ? 'text-success fw-bold'
                            : 'text-black fw-medium'
                        }
                        onClick={handleClose}
                      >
                        {item.name}
                      </NavLink>
                    </div>
                  ))}
                </>
              )}
              <hr/>
              <div className='d-flex align-items-center' onClick={LogOut}>
                <Power className='me-2 ' />
                <span className='fw-medium fs-5'>Logout</span>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}
