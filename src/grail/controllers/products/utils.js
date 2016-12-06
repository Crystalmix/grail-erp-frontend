/* @flow weak */
/* eslint no-param-reassign: 0 */

import type { ProductItemObject, PriceObject, StockObject, Transaction } from '../../types'


export const getQuantity = (ProductItem: ProductItemObject): number => (
  ProductItem.prices.reduce((total, price: PriceObject) => (
    total + price.stocks.reduce((totalStock, stock: StockObject) => (
      totalStock + stock.quantity
    ), 0)
  ), 0)
)

export const getQuantityByWarehouses = (ProductItem: ProductItemObject): {[key: string]: number} => (
  ProductItem.prices.reduce((acc, price) => {
    price.stocks.forEach((stock) => {
      acc[stock.warehouse] = (acc[stock.warehouse] || 0) + stock.quantity
    })
    return acc
  }, {}))

export const getQuantityByWarehouse = (ProductItem: ProductItemObject, warehouseId: number): number => (
  ProductItem.prices.reduce((total, price) => (
    total + price.stocks.filter((stock) =>
      stock.warehouse === warehouseId).reduce((stockTotal, stock) =>
        stockTotal + stock.quantity, 0)
  ), 0)
)

export const updateStock = (transaction: Transaction, productItem: ProductItemObject): ProductItemObject => {
  const newProductItem = { ...productItem }
  const productPrice: PriceObject | void = newProductItem.prices.find((i: PriceObject) => (
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
