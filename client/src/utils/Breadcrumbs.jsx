import { NavLink } from 'react-router-dom'
import useBreadcrumbs from 'use-react-router-breadcrumbs'

const DynamicCollectionBreadcrumb = ({ match }) => (
  <span>{[match.params.collectionId]}</span>
)
const DynamicProductBreadcrumb = ({ match }) => (
  <span>{[match.params.slug]}</span>
)

const routes = [
  { path: '/collections', breadcrumb: 'Collections' },
  {
    path: '/:collectionId',
    breadcrumb: DynamicCollectionBreadcrumb,
  },
  {
    path: '/:slug',
    breadcrumb: DynamicProductBreadcrumb,
  },
  {
    path: '/:username',
    breadcrumb: DynamicProductBreadcrumb,
  },
  // { path: '/search', breadcrumb: 'Search' },
  // { path: '/bag', breadcrumb: 'Bag' },
  // { path: '/checkout', breadcrumb: 'Checkout' },
  // { path: '/recover-password', breadcrumb: 'Recover' },
]

function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs(routes)

  return (
    <>
      <span className='d-flex flex-wrap'>
        {breadcrumbs.map(({ breadcrumb, match }, index) => (
          <span key={match.pathname}>
            <NavLink
              to={match.pathname}
              className={({ isActive }) =>
                isActive === match.pathname
                  ? 'text-secondary fw-bold fs-6'
                  : 'text-black fs-6'
              }
            >
              {breadcrumb}
            </NavLink>
            {index !== breadcrumbs.length - 1 && '/'}
          </span>
        ))}
      </span>
    </>
  )
}

export default Breadcrumbs
