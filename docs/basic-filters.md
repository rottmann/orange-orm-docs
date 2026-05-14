# Basic filters

Filters are a versatile tool for both data retrieval and bulk deletions. They allow for precise targeting of records based on specific criteria and can be combined with operators like `any` and `exists` and even raw sql for more nuanced control. Filters can also be nested to any depth, enabling complex queries that can efficiently manage and manipulate large datasets. This dual functionality enhances database management by ensuring data relevance and optimizing performance.

## Equal

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.customer.getMany({
    where x => x.name.equal('Harry')
  });
}
```

## Not equal

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.customer.getMany({
    where x => x.name.notEqual('Harry')
  });
}
```

## Contains

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.customer.getMany({
    where: x => x.name.contains('arr')
  });
}
```

## Starts with

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const filter = db.customer.name.startsWith('Harr');

  const rows = await db.customer.getMany({
    where: x => x.name.startsWith('Harr')
  });
}
```

## Ends with

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.customer.getMany({
    where: x => x.name.endsWith('arry')
  });
}
```

## Greater than

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: x => x.orderDate.greaterThan('2023-07-14T12:00:00')
  });
}
```

## Greater than or equal

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: x => x.orderDate.greaterThanOrEqual('2023-07-14T12:00:00')
  });
}
```

## Less than

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: x => x.orderDate.lessThan('2023-07-14T12:00:00')
  });
}
```

## Less than or equal

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: x => x.orderDate.lessThanOrEqual('2023-07-14T12:00:00')
  });
}
```

## Between

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: x => x.orderDate.between('2023-07-14T12:00:00', '2024-07-14T12:00:00')
  });
}
```

## Column-to-column filters

You can compare one column to another column instead of comparing to a constant value.
This works both on the same table and across relations.

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  // equality between related columns
  const sameName = await db.order.getMany({
    where: x => x.deliveryAddress.name.eq(x.customer.name)
  });

  // string pattern match against another column
  const containsName = await db.order.getMany({
    where: x => x.deliveryAddress.name.contains(x.customer.name)
  });

  // column as one of the bounds in between
  const withColumnBound = await db.customer.getMany({
    where: x => x.balance.between(x.id, 180)
  });
}
```

## In

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: x => x.customer.name.in('George', 'Harry')
  });

}
```

## Raw sql filter

You can use the raw SQL filter alone or in combination with a regular filter.
Here the raw filter queries for customer with name ending with `arry`. The composite filter combines the raw SQL filter and a regular filter that checks for a customer balance greater than 100. It is important to note that due to security precautions aimed at preventing SQL injection attacks, using raw SQL filters directly via browser inputs is not allowed. Attempting to do so will result in an HTTP status 403 (Forbidden) being returned.

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rawFilter = {
    sql: 'name like ?',
    parameters: ['%arry']
  };

  const rowsWithRaw = await db.customer.getMany({
    where: () => rawFilter
  });

  const rowsWithCombined = await db.customer.getMany({
    where: x => x.balance.greaterThan(100).and(rawFilter)
  });
}
```
