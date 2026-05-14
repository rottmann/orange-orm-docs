---
url: /orange-orm-docs/logical-filters.md
---
# And, or, not, exists

These operators serve as the backbone for constructing complex queries that allow for more granular control over the data fetched from the database. The examples provided below are self-explanatory for anyone familiar with basic programming concepts and database operations. The design philosophy underscores the importance of clear, readable code that doesn't sacrifice power for simplicity.

## And

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: x => x.customer.name.equal('Harry')
      .and(x.orderDate.greaterThan('2023-07-14T12:00:00'))
  });
}
```

## Or

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {

  const rows = await db.order.getMany({
    where: y => y.customer( x => x.name.equal('George')
      .or(x.name.equal('Harry')))
  });
}
```

## Not

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  //Neither George nor Harry
  const rows = await db.order.getMany({
    where: y => y.customer(x => x.name.equal('George')
        .or(x.name.equal('Harry')))
      .not()
  });
}
```

## Exists

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: x => x.deliveryAddress.exists()
  });
}
```
