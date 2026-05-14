---
url: /orange-orm-docs/aggregates.md
---
# Aggregate functions

You can count records and aggregate numerical columns.  This can either be done across rows or separately for each row.
Supported functions include:

* `count`
* `sum`
* `min`
* `max`
* `avg`

## On each row

In this example, we are counting the number of lines on each order.  This is represented as the property `numberOfLines`. You can name these aggregated properties whatever you want.

You can also elevate associated data to the a parent level for easier access. In the example below, `balance` of the customer is elevated to the root level.

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const orders = await db.order.getMany({
    numberOfLines: x => x.count(x => x.lines.id),
    totalAmount: x => x.sum(x => lines.amount),
    balance: x => x.customer.balance
  });
}
```

## Across all rows

The aggregate function effeciently groups data together.
In this particular example , for each customer, it counts the number of lines associated with their orders and calculates the total amount of these lines.
Under the hood, it will run an sql group by `customerId` and `customerName`.

```js
import map from './map';
const db = map.sqlite('demo.db');

getAggregates();

async function getAggregates() {
  const orders = await db.order.aggregate({
    where: x => x.orderDate.greaterThan(new Date(2022, 0, 11, 9, 24, 47)),
    customerId: x => x.customerId,
    customerName: x => x.customer.name,
    numberOfLines: x => x.count(x => x.lines.id),
    totals: x => x.sum(x => lines.amount)
  });
}
```

## Count

For convenience, you can use the `count` directly on the table instead of using the aggregated query syntax.

```js
import map from './map';
const db = map.sqlite('demo.db');

getCount();

async function getCount() {
  const filter = db.order.lines.any(
    line => line.product.contains('broomstick')
  );
  const count = await db.order.count(filter);
  console.log(count); //2
}
```
