/* @flow */

export type StockObject = {|
  id: number,
  warehouse: number,
  quantity: number,
|}

export type PriceObject = {|
  id: number,
  price: string,
  stocks: StockObject[],
|}

export type ProductItemObject = {
  id: number,
  Code: string,
  weight: number | null,
  data: {[key: string]: string},
  is_active: boolean,
  prices: PriceObject[],
}

export type ProductObject = {
  id: number,
  Code: string,
  Name: string,
  Description: string,
  Account: number | null,
  TaxRate: number | null,
  items: ProductItemObject[],
}

export type Transaction = {|
  id: number,
  product_price_id: number,
  product_item_id: number,
  warehouse: number,
  quantity: number,
  description: string,
|}
