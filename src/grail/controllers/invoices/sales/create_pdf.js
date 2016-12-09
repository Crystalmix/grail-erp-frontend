/* @flow weak */
/* eslint no-param-reassign: 0 */

import _ from 'underscore'

/* eslint no-underscore-dangle: 0 */
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}

export default ($scope, api, $q, xero, pdfmake, auth_status) => {
  let org = {}

  api.getOrganizartions().then(resp => { org = __guard__(resp, x => x.data[0]) })

  const updateDate = (date) => {
    const objDate = new Date(date)
    const locale = 'en-us'
    const opts = { day: 'numeric', month: 'long', year: 'numeric' }
    return objDate.toLocaleString(locale, opts)
  }

  const updateLocation = (locations, sale) =>
      _.find(locations, val => val.id === sale.Location)


  const updateAddress = addresses =>
      _.find(addresses, val => val.AddressType === xero.customer.address_type)


  const addHeaderToTabel = () =>
    [{ text: 'Code', bold: true }, { text: 'Description', bold: true }, { text: 'Quantity', bold: true },
                      { text: 'Unit Price', bold: true }, { text: 'Amount', bold: true }]


  const addTableContent = function (body, lineItems, products) {
    _.each(lineItems, (lineItem) => {
      if (lineItem.Product) {
        const product_obj = _.find(products, (product) => {
          const item = _.find(product.items, product_item => product_item.id === lineItem.Product)
          if (item) {
            return _.extend(item, { Description: product.Description })
          }
        })
        let amount = (lineItem.Quantity * lineItem.UnitAmount) || 0
        amount = amount.toFixed(2)
        var line = [product_obj.Code, product_obj.Description, `${lineItem.Quantity}`,
          `$${lineItem.UnitAmount}`, `$${amount}`]
      }
      return body.push(line)
    })
    return body
  }

  const updateTableBody = (lineItems, products, tax_rates, subtotal, tax, total) => {
    let body = [addHeaderToTabel()]
    body = _.compact(addTableContent(body, lineItems, products))
    body.push([{ text: 'Subtotal', bold: true }, { text: '' }, { text: '' }, { text: '' }, { text: `$${subtotal.toFixed(2)}`, bold: true }])
    body.push([{ text: 'Tax', bold: true }, { text: '' }, { text: '' }, { text: '' }, { text: `$${tax.toFixed(2)}`, bold: true }])
    body.push([{ text: 'Total', bold: true }, { text: '' }, { text: '' }, { text: '' }, { text: `$${total.toFixed(2)}`, bold: true }])
    return body
  }


  const makeContent = (org, sale, location_attention, customer, products, tax_rates, subtotal, tax, total) => {
    if (sale.Date) { var date = updateDate(sale.Date) }
    if (customer.Locations) { var location = updateLocation(customer.Locations, sale) }
    if (customer.Addresses) { var custom_addr = updateAddress(customer.Addresses) }
    const table_body = updateTableBody(sale.LineItems, products, tax_rates, subtotal, tax, total)
    return {
      content: [
        {
          columns: [
            {
              text: `${__guard__(__guard__(org, x1 => x1.data), x => x.LegalName) || ''}`,
              style: ['header', 'margin_bottom'],
            },
            {
              text: 'Tax Invoice',
              alignment: 'right',
              style: ['header', 'margin_bottom'],
            },
          ],
        },
        {
          columns: [
            {
              text: `${__guard__(__guard__(__guard__(org, x4 => x4.data), x3 => x3.Addresses), x2 => x2[0].AddressLine1) || ''}
                                ${__guard__(__guard__(__guard__(org, x7 => x7.data), x6 => x6.Addresses), x5 => x5[0].AddressLine2) || ''}
                                ${__guard__(__guard__(__guard__(org, x10 => x10.data), x9 => x9.Addresses), x8 => x8[0].AddressLine3) || ''}
                                ${__guard__(__guard__(__guard__(org, x13 => x13.data), x12 => x12.Addresses), x11 => x11[0].City) || ''}
                                ${__guard__(__guard__(__guard__(org, x16 => x16.data), x15 => x15.Addresses), x14 => x14[0].PostalCode) || ''}
                                ${__guard__(__guard__(org, x18 => x18.data), x17 => x17.TaxNumber) || ''}
                                ${__guard__(__guard__(org, x20 => x20.data), x19 => x19.Phones[0].PhoneAreaCode) || ''} ${__guard__(__guard__(org, x22 => x22.data), x21 => x21.Phones[0].PhoneNumber) || ''}
                                ${auth_status.getUser()}\
`,
            },
            {
              alignment: 'right',
              style: 'margin_bottom',
              text: `${date || ''}
Invoice Number ${sale.InvoiceNumber || ''}\
`,
            },
          ],
        },
        {
          columns: [
                      { text: '' },
            {
              alignment: 'right',
              style: 'margin_bottom',
              text: 'Invoice Address',
              bold: true,
              fontSize: 15,
            },
          ],
        },
        {
          columns: [
                      { text: '' },
            {
              alignment: 'right',
              style: 'margin_bottom',
              text: `${customer.LastName || ''}
                              ${custom_addr.AddressLine1 || ''} ${custom_addr.AddressLine2 || ''} ${custom_addr.AddressLine3 || ''} ${custom_addr.City || ''} ${custom_addr.Country || ''}\
`,
            },
          ],
        },
        {
          columns: [
                      { text: '' },
            {
              alignment: 'right',
              style: 'margin_bottom',
              text: 'Delivery Address',
              bold: true,
              fontSize: 15,
            },
          ],
        },
        {
          columns: [
                      { text: '' },
            {
              alignment: 'right',
              style: 'margin_bottom',
              text: `${location.Name}
                              ${location.AddressLine1 || ''} ${location.AddressLine2 || ''} ${location.AddressLine3 || ''} ${location.City || ''} ${location.Country || ''}`,
            },
          ],
        },
        {
          columns: [
                      { text: '' },
            {
              alignment: 'right',
              style: 'margin_bottom',
              bold: true,
              fontSize: 20,
              text: `Att: ${location_attention || ''}
                              ${customer.Name || ''}` },
          ],
        },
              { text: 'Items', bold: true, style: 'margin_bottom' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', 'auto', '*', '*'],
            body: table_body,
          },
        },
      ],
      footer: [{
        style: 'footer',
        text: `${customer.LastName || ''}
                          ${custom_addr.AddressLine1 || ''} ${custom_addr.AddressLine2 || ''} ${custom_addr.AddressLine3 || ''} ${custom_addr.City || ''} ${custom_addr.Country || ''}\
`,
      }],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        customer_col: {
          bold: true,
          fontSize: 20,
        },
        margin_bottom: {
          margin: [0, 0, 0, 10],
        },
        footer: {
          margin: [40, 0, 0, 0],
        },
      },
    }
  }


  $scope.pdf = function (sale, location_attention, customers, products, tax_rates, subtotal, tax, total) {
    const customer = _.find(customers, val => val.id === sale.Contact)
    const content = makeContent(org, sale, location_attention, customer, products, tax_rates, subtotal, tax, total)
    const doc = pdfmake.create(content)
    return pdfmake.open(doc)
  }
}
