---
url: /orange-orm-docs/deleting-rows.md
---
# Deleting rows

Rows in owner tables cascade deletes to their child tables. In essence, if a table has ownership over other tables through `hasOne` and `hasMany` relationships, removing a record from the parent table also removes its corresponding records in its child tables. This approach safeguards against leaving orphaned records and upholds data integrity. On the contrary, tables that are merely referenced, through `reference relationships`, remain unaffected upon deletions.\
For a deeper dive into these relationships and behaviors, refer to the section on [Mapping tables](./mapping-tables).

## Deleting a single row

```js
import map from './map';
const db = map.sqlite('demo.db');

deleteRow();

async function deleteRow() {
  const order = await db.order.getById(1);

  await order.delete();
  //will also delete deliveryAddress and lines
  //but not customer
}
```

## Deleting a row in an array

A common workflow involves retrieving multiple rows, followed by the need to delete a specific row from an array. This operation is straightforward to do with , which allow for the updating, inserting, and deleting of multiple rows in a single transaction. To modify the array, simply add, update, or remove elements, and then invoke the `saveChanges()` method on the array to persist the changes.

```js
import map from './map';
const db = map.sqlite('demo.db');

updateInsertDelete();

async function updateInsertDelete() {
  const orders = await db.order.getMany({
    customer: true,
    deliveryAddress: true,
    lines: true
  });

  //will add line to the first order
  orders[0].lines.push({
    product: 'secret weapon',
    amount: 355
  });

  //will delete second row
  orders.splice(1, 1);

  //will insert a new order with lines, deliveryAddress and set customerId
  orders.push({
    orderDate: new Date(2022, 0, 11, 9, 24, 47),
    customer: {
      id: 1
    },
    deliveryAddress: {
      name: 'George',
      street: 'Node street 1',
      postalCode: '7059',
      postalPlace: 'Jakobsli',
      countryCode: 'NO'
    },
    lines: [
      { product: 'Magic tent', amount: 349 }
    ]
  });

  await orders.saveChanges();

}
```

## Deleting many rows

```js
import map from './map';
const db = map.sqlite('demo.db');

deleteRows();

async function deleteRows() {
  let orders = await db.order.getMany({
    where: x => x.customer.name.eq('George')
  });

  await orders.delete();
}
```

## Deleting with concurrency

Concurrent operations can lead to conflicts. When you still want to proceed with the deletion regardless of potential interim changes, the 'overwrite' concurrency strategy can be used. This example demonstrates deleting rows even if the "delivery address" has been modified in the meantime.\
You can read more about concurrency strategies in [Updating rows](./updating-rows).

```js
import map from './map';
const db = map.sqlite('demo.db');

deleteRows();

async function deleteRows() {
  let orders = await db.order.getMany({
    where: x => x.deliveryAddress.name.eq('George'),
    customer: true,
    deliveryAddress: true,
    lines: true
  });

  await orders.delete({
    deliveryAddress: {
      concurrency: 'overwrite'
    }
  });
}
```

## Batch delete

When removing a large number of records based on a certain condition, batch deletion can be efficient.

However, it's worth noting that batch deletes don't follow the cascade delete behavior by default. To achieve cascading in batch deletes, you must explicitly call the deleteCascade method.

```js
import map from './map';
const db = map.sqlite('demo.db');

deleteRows();

async function deleteRows() {
  const filter = db.order.deliveryAddress.name.eq('George');
  await db.order.delete(filter);
}
```

## Batch delete cascade

When deleting records, sometimes associated data in related tables also needs to be removed. This cascade delete helps maintain database integrity.

```js
import map from './map';
const db = map.sqlite('demo.db');

deleteRows();

async function deleteRows() {
  const filter = db.order.deliveryAddress.name.eq('George');
  await db.order.deleteCascade(filter);
}
```

## Batch delete by primary key

For efficiency, you can also delete records directly if you know their primary keys.

```js
import map from './map';
const db = map.sqlite('demo.db');

deleteRows();

async function deleteRows() {
  db.customer.delete([{id: 1}, {id: 2}]);
}
```
