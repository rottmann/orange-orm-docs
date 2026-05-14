---
url: /orange-orm-docs/upserting-rows.md
---
# Upserting rows

It is possible to perform 'upserts' by taking advantage of the 'overwrite' strategy.

Currently, there are three concurrency strategies:

* **`optimistic`** Raises an exception if another row was already inserted on that primary key.
* **`overwrite`** Overwrites the property, regardless of changes by others.
* **`skipOnConflict`** Silently avoids updating the property if another user has modified it in the interim.

The `concurrency` option can be set either for the whole table or individually for each column. In the example below, we've set the concurrency strategy on `vendor` table to **overwrite** except for the column `balance+ which uses the`skipOnConflict\` strategy.

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
