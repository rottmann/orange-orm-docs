---
url: /orange-orm-docs/example.md
---
# Example

![Relations diagram](/diagram.svg)

```ts
import orange from 'orange-orm';

const map = orange.map(x => ({
  customer: x.table('customer').map(({ column }) => ({
    id: column('id').numeric().primary().notNullExceptInsert(),
    name: column('name').string(),
    balance: column('balance').numeric(),
    isActive: column('isActive').boolean(),
  })),

  order: x.table('_order').map(({ column }) => ({
    id: column('id').numeric().primary().notNullExceptInsert(),
    orderDate: column('orderDate').date().notNull(),
    customerId: column('customerId').numeric().notNullExceptInsert(),
  })),

  orderLine: x.table('orderLine').map(({ column }) => ({
    id: column('id').numeric().primary(),
    orderId: column('orderId').numeric(),
    product: column('product').string(),
    amount: column('amount').numeric(),
  })),

  package: x.table('package').map(({ column }) => ({
    id: column('packageId').numeric().primary().notNullExceptInsert(),
    lineId: column('lineId').numeric().notNullExceptInsert(),
    sscc: column('sscc').string() //the barcode
  })),

  deliveryAddress: x.table('deliveryAddress').map(({ column }) => ({
    id: column('id').numeric().primary(),
    orderId: column('orderId').numeric(),
    name: column('name').string(),
    street: column('street').string(),
    postalCode: column('postalCode').string(),
    postalPlace: column('postalPlace').string(),
    countryCode: column('countryCode').string().enum(['NO', 'SE', 'DK', 'FI', 'IS', 'DE', 'FR', 'NL', 'ES', 'IT']),
  }))

})).map(x => ({
  orderLine: x.orderLine.map(({ hasMany }) => ({
    packages: hasMany(x.package).by('lineId')
  })),
  order: x.order.map(v => ({
    customer: v.references(x.customer).by('customerId'),
    lines: v.hasMany(x.orderLine).by('orderId'),
    deliveryAddress: v.hasOne(x.deliveryAddress).by('orderId'),
  }))
}));

export default map;

```

```ts
import map from './map';
const db = map.sqlite('demo.db');

updateRow();

async function updateRow() {
  const order = await db.order.getById(2, {
    lines: true
  });
  order.lines.push({
    product: 'broomstick',
    amount: 300
  });

  await order.saveChanges();
}

```

```ts
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const orders = await db.order.getMany({
    where: x => x.lines.any(line => line.product.contains('broomstick'))
      .and(x.customer.name.startsWith('Harry')),
    lines: {
      packages: true
    },
    deliveryAddress: true,
    customer: true
  });
}

```

## Tutorial on YouTube

Watch the [tutorial video on YouTube](https://youtu.be/1IwwjPr2lMs)
