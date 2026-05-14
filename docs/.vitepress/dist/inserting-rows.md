---
url: /orange-orm-docs/inserting-rows.md
---
# Inserting rows

In the code below, we initially import the table-mapping feature `map.ts` and the setup script `init.ts`, both of which were defined in the preceding step. The setup script executes a raw query that creates the necessary tables. Subsequently, we insert two customers, named "George" and "Harry", into the `customer` table, and this is achieved through calling `db.customer.insert`.

Next, we insert an array of two orders in the `order` table. Each order contains an `orderDate`, `customer` information, `deliveryAddress`, and `lines` for the order items.
We use the customer constants "george" and "harry" from previous inserts. Observe that we don't pass in any primary keys. This is because all tables here have autoincremental keys.

The second argument to `db.order.insert` specifies a fetching strategy. This fetching strategy plays a critical role in determining the depth of the data retrieved from the database after insertion. The fetching strategy specifies which associated data should be retrieved and included in the resulting orders object.\
In this case, the fetching strategy instructs the database to retrieve the `customer`, `deliveryAddress`, and `lines` for each order.

Without a fetching strategy, `db.order.insert` would only return the root level of each order. In that case you would only get the `id`, `orderDate`, and `customerId` for each order.

```js
import map from './map';
const db = map.sqlite('demo.db');
import init from './init';

insertRows();

async function insertRows() {
  await init();

  const george = await db.customer.insert({
    name: 'George',
    balance: 177,
    isActive: true
  });

  const harry = await db.customer.insert({
    name: 'Harry',
    balance: 200,
    isActive: true
  });

  const orders = await db.order.insert([
    {
      orderDate: new Date(2022, 0, 11, 9, 24, 47),
      customer: george,
      deliveryAddress: {
        name: 'George',
        street: 'Node street 1',
        postalCode: '7059',
        postalPlace: 'Jakobsli',
        countryCode: 'NO'
      },
      lines: [
        { product: 'Bicycle', amount: 250 },
        { product: 'Small guitar', amount: 150 }
      ]
    },
    {
      customer: harry,
      orderDate: new Date(2021, 0, 11, 12, 22, 45),
      deliveryAddress: {
        name: 'Harry Potter',
        street: '4 Privet Drive, Little Whinging',
        postalCode: 'GU4',
        postalPlace: 'Surrey',
        countryCode: 'UK'
      },
      lines: [
        { product: 'Magic wand', amount: 300 }
      ]
    }
  ], {customer: true, deliveryAddress: true, lines: true}); //fetching strategy
}
```

## Conflict resolution

By default, the strategy for inserting rows is set to an optimistic approach. In this case, if a row is being inserted with an already existing primary key, the database raises an exception.

Currently, there are three concurrency strategies:

* **`optimistic`** Raises an exception if another row was already inserted on that primary key.
* **`overwrite`** Overwrites the property, regardless of changes by others.
* **`skipOnConflict`** Silently avoids updating the property if another user has modified it in the interim.

The `concurrency` option can be set either for the whole table or individually for each column. In the example below, we've set the concurrency strategy on `vendor` table to **overwrite** except for the column `balance` which uses the `skipOnConflict`strategy.

In this particular case, a row with `id: 1` already exists, the `name` and `isActive` fields will be overwritten, but the balance will remain the same as in the original record, demonstrating the effectiveness of combining multiple `concurrency` strategies.

```js
import map from './map';
const db = map.sqlite('demo.db');

insertRows();

async function insertRows() {

  db2 = db({
    vendor: {
      balance: {
        concurrency: 'skipOnConflict'
      },
      concurrency: 'overwrite'
    }
  });

  await db2.vendor.insert({
    id: 1,
    name: 'John',
    balance: 100,
    isActive: true
  });

  //this will overwrite all fields but balance
  const george = await db2.vendor.insert({
    id: 1,
    name: 'George',
    balance: 177,
        isActive: false
  });
  console.dir(george, {depth: Infinity});
  // {
  //   id: 1,
  //   name: 'George',
  //   balance: 100,
  //   isActive: false
  // }
}
```
