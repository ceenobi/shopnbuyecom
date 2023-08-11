import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Search, X } from 'react-feather'
import { Dropdown, Image } from 'react-bootstrap'
import Sidebar from './Sidebar'
import useDataFetching from '../hooks/fetchData'
import { getCategories } from '../config/api'
import Account from './Account'
import { useStore } from '../hooks/store'
import ShoppingBag from './ShoppingBagModal'

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { data } = useDataFetching(getCategories)
  const { currentUser, LogOut } = useStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery) {
      navigate(`search/?q=${searchQuery}`)
    }
  }

  return (
    <nav className='py-2 px-3 shadow fixed-top z-3 w-100 bg-white'>
      <div className='layout-container'>
        <div className='d-flex align-items-center'>
          {!showSearch && (
            <>
              <Sidebar />
              <NavLink to='/' className='fs-3 text-black fw-bold me-4 mt-1'>
                SHOP
              </NavLink>

              <Dropdown className='d-none d-lg-block flex-grow-1'>
                <Dropdown.Toggle
                  variant='none'
                  id='dropdown-basic'
                  className='text-black fw-bold fs-5'
                  size='sm'
                >
                  COLLECTION
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {data?.map((category) => (
                    <Dropdown.Item
                      as={NavLink}
                      key={category._id}
                      to={`/collections/${category.name}`}
                      className={({ isActive, isPending }) =>
                        isPending
                          ? 'text-black '
                          : isActive
                          ? 'text-success fw-bold'
                          : 'text-black '
                      }
                    >
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <div className='d-flex gap-4 align-items-center ms-auto'>
                <Search
                  type='button'
                  onClick={() => setShowSearch(!showSearch)}
                />
                <ShoppingBag />
                {currentUser ? (
                  <Dropdown>
                    <Dropdown.Toggle variant='none' id='dropdown-basic'>
                      <Image
                        src={currentUser?.user?.profileImg}
                        alt={currentUser?.user?.username}
                        roundedCircle
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                        }}
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.ItemText className='text-capitalize fw-bold'>
                        {' '}
                        Hi, {currentUser?.user?.username}
                      </Dropdown.ItemText>
                      <Dropdown.Item
                        as={NavLink}
                        to={`account/${currentUser?.user?.username}/orders`}
                      >
                        Orders
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={NavLink}
                        to={`account/user-profile/${currentUser?.user?.username}`}
                      >
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={NavLink}
                        to={`account/${currentUser?.user?.username}/wishlist`}
                      >
                        Wishlist
                      </Dropdown.Item>
                      <Dropdown.Item onClick={LogOut}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Account />
                )}
              </div>
            </>
          )}
          {showSearch && (
            <form
              className='position-relative ms-auto searchBox'
              onSubmit={handleSubmit}
            >
              <input
                type='text'
                placeholder='Search for shoes, beauty, and more...'
                className='position-absolute top-50 start-50 translate-middle search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <X
                type='button'
                className='position-absolute top-50 end-0 translate-middle'
                onClick={() => setShowSearch(!showSearch)}
              />
            </form>
          )}
        </div>
      </div>
    </nav>
  )
}
