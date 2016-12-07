/* @flow weak */
/* eslint no-param-reassign: 0 */

import type { ProductItem, Price, Stock, Transaction } from '../../types'


export const getQuantity = (productItem: ProductItem): number => (
  productItem.prices.reduce((total, price: Price) => (
    total + price.stocks.reduce((totalStock, stock: Stock) => (
      totalStock + stock.quantity
    ), 0)
  ), 0)
)

export const getQuantityByWarehouses = (productItem: ProductItem): {[key: string]: number} => (
  productItem.prices.reduce((acc, price) => {
    price.stocks.forEach((stock) => {
      acc[stock.warehouse] = (acc[stock.warehouse] || 0) + stock.quantity
    })
    return acc
  }, {}))

export const getQuantityByWarehouse = (productItem: ProductItem, warehouseId: number): number => (
  productItem.prices.reduce((total, price) => (
    total + price.stocks.filter((stock) =>
      stock.warehouse === warehouseId).reduce((stockTotal, stock) =>
        stockTotal + stock.quantity, 0)
  ), 0)
)

export const updateStock = (transaction: Transaction, productItem: ProductItem): ProductItem => {
  const newProductItem = { ...productItem }
  const productPrice: Price | void = newProductItem.prices.find((i: Price) => (
    i.id === transaction.product_price_id
  ))
  if (productPrice) {
    const stock = productPrice.stocks.find(i => i.warehouse === transaction.warehouse)

    if (stock) {
      stock.quantity += transaction.quantity
    } else {
      const newStock = {
        warehouse: transaction.warehouse,
        quantity: transaction.quantity,
      }
      productPrice.stocks.push(newStock)
    }
  } else {
    const newStock = {
      warehouse: transaction.warehouse,
      quantity: transaction.quantity,
    }
    const newProductPrice = {
      id: transaction.product_price_id,
      stocks: [newStock],
    }
    newProductItem.prices.push(newProductPrice)
  }
  return newProductItem
}
