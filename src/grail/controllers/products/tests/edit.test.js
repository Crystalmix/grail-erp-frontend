/* @flow weak */
/* global describe, it, afterEach, beforeEach */

import { assert } from 'chai'
import _ from 'lodash'

import type { ProductItem, Transaction } from '../../../types'
import { getQuantityByWarehouse, getQuantity, getQuantityByWarehouses, updateStock } from './../utils'

const transaction: Transaction = {
  id: 1,
  product_price_id: 1,
  product_item_id: 8,
  warehouse: 2,
  quantity: 100,
  description: 'Description',
}

const productItemFake: ProductItem = {
  id: 8,
  Code: 'imac24i58 Gb',
  weight: null,
  data: {
    RAM: '8 Gb',
    cpu: 'i5',
    size: '24',
  },
  is_active: true,
  prices: [
    {
      id: 1,
      price: '9.9900',
      stocks: [
        {
          id: 1,
          warehouse: 1,
          quantity: 10,
        }, {
          id: 2,
          warehouse: 2,
          quantity: 20,
        }, {
          id: 3,
          warehouse: 3,
          quantity: 30,
        },
      ],
    }, {
      id: 2,
      price: '19.9900',
      stocks: [
        {
          id: 1,
          warehouse: 1,
          quantity: 10,
        },
      ],
    }, {
      id: 3,
      price: '29.9900',
      stocks: [],
    },
  ],
}

describe('Test ProductEdit Controller', () => {
  it('getQuantity', () => {
    assert.equal(getQuantity(productItemFake), 70)
    assert.equal(getQuantity({ prices: [] }), 0)
  })

  it('getQuantityByWarehouses', () => {
    const expectedData = { '1': 20, '2': 20, '3': 30 }
    assert.deepEqual(getQuantityByWarehouses(productItemFake), expectedData)
  })

  it('getQuantityByWarehouse', () => {
    assert.equal(getQuantityByWarehouse(productItemFake, 1), 20)
    assert.equal(getQuantityByWarehouse(productItemFake, 2), 20)
    assert.equal(getQuantityByWarehouse(productItemFake, 3), 30)
    assert.equal(getQuantityByWarehouse(productItemFake, 4), 0)
  })

  it('updateStock (stock in)', () => {
    const productItem = _.cloneDeep(productItemFake)
    const newProductItem = updateStock(transaction, productItem)
    assert.equal(getQuantity(newProductItem), 170)
  })

  it('updateStock (stock out)', () => {
    const newTransaction = { ...transaction, quantity: -10 }
    const productItem = _.cloneDeep(productItemFake)
    const newProductItem = updateStock(newTransaction, productItem)
    assert.equal(getQuantity(newProductItem), 60)
  })

  it('updateStock (stock in => new price)', () => {
    const newTransaction = { ...transaction, quantity: 30, product_price_id: 66 }
    const productItem = _.cloneDeep(productItemFake)
    const newProductItem = updateStock(newTransaction, productItem)
    assert.equal(getQuantity(newProductItem), 100)

    const newPrice = newProductItem.prices.find(i => i.id === 66)
    assert(newPrice)
    assert.deepEqual(newPrice, {
      id: newTransaction.product_price_id,
      stocks: [{
        warehouse: newTransaction.warehouse,
        quantity: newTransaction.quantity,
      }],
    })
  })
})
