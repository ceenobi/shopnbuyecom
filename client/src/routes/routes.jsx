import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import {
  Account,
  AddProduct,
  Checkout,
  Collections,
  Categories,
  Home,
  ManageProduct,
  Order,
  OrderId,
  Orders,
  ProductDetail,
  Profile,
  Recover,
  Search,
  ViewBag,
  Wishlist,
  Reset,
} from '../pages'
import Root from '../components/Root'
import ProtectedRoutes from './ProtectedRoutes'
import { Error } from '../components'

export default function Routes() {
  const username = sessionStorage.getItem('username')
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <Error />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: 'collections',
          element: <Collections />,
          children: [
            {
              path: ':collectionId',
              element: <Categories />,
            },
            {
              path: ':collectionId/:slug',
              element: <ProductDetail />,
            },
          ],
        },
        {
          path: 'search',
          element: <Search />,
        },
        {
          path: 'bag',
          element: <ViewBag />,
        },
        {
          path: 'checkout',
          element: (
            <ProtectedRoutes>
              <Checkout />
            </ProtectedRoutes>
          ),
        },
        {
          path: 'recover-password',
          element: <Recover />,
        },
        {
          path: 'reset-password',
          element: username ? <Reset /> : <Navigate to={'/'} replace />,
        },
        {
          path: 'account',
          element: (
            <ProtectedRoutes>
              <Account />
            </ProtectedRoutes>
          ),
          children: [
            {
              path: ':username/orders',
              element: (
                <ProtectedRoutes>
                  <Order />
                </ProtectedRoutes>
              ),
              children: [
                {
                  path: ':id',
                  element: (
                    <ProtectedRoutes>
                      <OrderId />
                    </ProtectedRoutes>
                  ),
                },
              ],
            },
            {
              path: 'user-profile/:username',
              element: (
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              ),
            },
            {
              path: ':username/wishlist',
              element: (
                <ProtectedRoutes>
                  <Wishlist />
                </ProtectedRoutes>
              ),
            },
            {
              path: 'allorders',
              element: (
                <ProtectedRoutes>
                  <Orders />
                </ProtectedRoutes>
              ),
            },
            {
              path: 'add-new-product',
              element: (
                <ProtectedRoutes>
                  <AddProduct />
                </ProtectedRoutes>
              ),
            },
            {
              path: 'manage-product',
              element: (
                <ProtectedRoutes>
                  <ManageProduct />
                </ProtectedRoutes>
              ),
            },
          ],
        },
      ],
    },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
