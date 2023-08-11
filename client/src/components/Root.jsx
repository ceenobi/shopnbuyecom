import Footer from './Footer'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function Root() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '95vh' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
