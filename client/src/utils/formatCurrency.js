const currency_format = new Intl.NumberFormat(undefined, {
  currency: 'USD',
  style: 'currency',
})

export function formatCurrency(number) {
  return currency_format.format(number)
}
