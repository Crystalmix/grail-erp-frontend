// @flow

export type XeroConst = {
  customer: {
    address_type: string,
  },
  invoice: {
    sale_type: string,
    purchase_type: string,
  }
}

const xero : XeroConst = {
  customer: {
    address_type: 'POBOX',
  },
  invoice: {
    sale_type: 'ACCREC',
    purchase_type: 'ACCPAY',
  },
}

export default xero
