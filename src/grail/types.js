/* @flow */

export type Stock = {|
  id: number,
  warehouse: number,
  quantity: number,
|}

export type Price = {|
  id: number,
  price: string,
  stocks: Stock[],
|}

export type ProductItem = {
  id: number,
  Code: string,
  weight: number | null,
  data: {[key: string]: string},
  is_active: boolean,
  prices: Price[],
}

export type Product = {
  id: number,
  Code: string,
  Name: string,
  buy_price: string,
  sell_price: string,
  Description: string,
  Account: number | null,
  TaxRate: number | null,
  items: ProductItem[],
}

export type Transaction = {|
  id: number,
  product_price_id: number,
  product_item_id: number,
  warehouse: number,
  quantity: number,
  description: string,
|}
