/* @flow weak */
/* global describe, it, afterEach, beforeEach */

import { assert } from 'chai'

import type { ProductItemObject } from '../../../types'
import { getQuantityByWarehouse, getQuantity, getQuantityByWarehouses } from './../utils'

const ProductItem: ProductItemObject = {
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
        }
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
    assert.equal(getQuantity(ProductItem), 70)
    assert.equal(getQuantity({ prices: [] }), 0)
  })

  it('getQuantityByWarehouses', () => {
    const expectedData = { '1': 20, '2': 20, '3': 30 }
    assert.deepEqual(getQuantityByWarehouses(ProductItem), expectedData)
  })

  it('getQuantityByWarehouse', () => {
    assert.equal(getQuantityByWarehouse(ProductItem, 1), 20)
    assert.equal(getQuantityByWarehouse(ProductItem, 2), 20)
    assert.equal(getQuantityByWarehouse(ProductItem, 3), 30)
    assert.equal(getQuantityByWarehouse(ProductItem, 4), 0)
  })
})
