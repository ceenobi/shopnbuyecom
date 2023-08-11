import { Toaster } from 'react-hot-toast'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { StateContext } from './hooks/store'
import React, { lazy } from 'react'
import { Spinner } from 'react-bootstrap'
const Routes = lazy(() => import('./routes/routes'))

function Load() {
  return (
    <div className='d-flex flex-column gap-3 justify-content-center align-items-center vh-100'>
      <Spinner animation='grow' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
      <p className='fw-medium'>Welcome to SHOP N BUY</p>
    </div>
  )
}

function App() {

  return (
    <>
      <StateContext>
        <PayPalScriptProvider deferLoading={true}>
          <Toaster />
          <React.Suspense fallback={<Load />}>
            <Routes />
          </React.Suspense>
        </PayPalScriptProvider>
      </StateContext>
    </>
  )
}

export default App
