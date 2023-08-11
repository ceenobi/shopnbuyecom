import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

export default function Paypal({ total, placeOrder }) {
  const amount = total
  const currency = 'USD'
  const style = { layout: 'vertical' }

  const createPaypalOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: 'Your purchase details',
            amount: {
              currency_code: currency,
              value: amount,
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID
      })
  }

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function () {
      placeOrder()
    })
  }

  return (
    <PayPalScriptProvider
      options={{
        'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
        components: 'buttons',
        currency: 'USD',
      }}
    >
      <PayPalButtons
        style={style}
        createOrder={createPaypalOrder}
        onApprove={onApprove}
        forceReRender={[amount, currency, style]}
      />
    </PayPalScriptProvider>
  )
}
