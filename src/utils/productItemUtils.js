export const tableColumnsWidth = {
  productCode: 13,
  productNameMulti: 26,
  productName: 33,
  price: 10,
  qty: 7,
  subTotal: 10,
  disc: 10,
  tax: 7,
  total: 12
}

export const calculatPercentage = (value, percent) =>
  Math.round(((value * Number(percent || 0)) / 100) * 100) / 100

export const calculateTotalWithDiscountAndTax = (
  { items, discount, tax },
  isMultipleShip = false
) => {
  const itemTotal = items.reduce(
    (a, b) => a + b.items.reduce((x, y) => x + y.total, 0),
    0
  )
  const itemSubTotal = items.reduce(
    (a, b) => a + b.items.reduce((x, y) => x + y.subTotal, 0),
    0
  )
  const subTotalWithDicount =
    itemSubTotal -
    items.reduce((a, b) => a + b.items.reduce((x, y) => x + y.discount, 0), 0)

  let grandTotal = calculateGrandTotal(
    isMultipleShip ? itemTotal : itemSubTotal,
    isMultipleShip ? 0 : tax,
    !isMultipleShip
      ? items.reduce(
          (a, b) => a + b.items.reduce((x, y) => x + y.discount, 0),
          0
        )
      : calculatPercentage(subTotalWithDicount, discount)
  )

  if (!isMultipleShip) {
    grandTotal -= calculatPercentage(subTotalWithDicount, discount)
  }

  return {
    subTotal: itemTotal,
    grandTotal
  }
}

export const calculateSubTotal = (price, qty) => {
  return Number(price || 0) * Number(qty || 1)
}

export const calculateSubTotalWithDiscount = (price, qty, discount) => {
  return Number(price || 0) * Number(qty || 1) - Number(discount || 0)
}

export const calculateSubTotalWithTax = (price, qty, tax) => {
  const subTotal = Number(price || 0) * Number(qty || 1)
  return subTotal + calculatPercentage(subTotal, tax)
}

export const calculateGrandTotal = (subTotal, tax, discount = 0) => {
  const totalAddTax = subTotal + calculatPercentage(subTotal, tax)
  return totalAddTax - discount
}
