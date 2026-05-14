---
url: /orange-orm-docs/logging.md
---
# Logging

You enable logging by listening to the query event on the `orange` object. During this event, both the SQL statement and any associated parameters are logged. The logged output reveals the sequence of SQL commands executed, offering developers a transparent view into database operations, which aids in debugging and ensures data integrity.

```js
import orange from 'orange-orm';
import map from './map';
const db = map.sqlite('demo.db');

orange.on('query', (e) => {
  console.log(e.sql);
  if (e.parameters.length > 0)
    console.log(e.parameters);
});

updateRow();

async function updateRow() {
  const order = await db.order.getById(2, {
    lines: true
  });
  order.lines.push({
    product: 'broomstick',
    amount: 300,
  });

  await order.saveChanges();
}
```

```bash
select  _order.id as s_order0,_order.orderDate as s_order1,_order.customerId as s_order2 from _order _order where _order.id=2 order by _order.id limit 1
select  orderLine.id as sorderLine0,orderLine.orderId as sorderLine1,orderLine.product as sorderLine2,orderLine.amount as sorderLine3 from orderLine orderLine where orderLine.orderId in (2) order by orderLine.id
BEGIN
select  _order.id as s_order0,_order.orderDate as s_order1,_order.customerId as s_order2 from _order _order where _order.id=2 order by _order.id limit 1
INSERT INTO orderLine (orderId,product,amount) VALUES (2,?,300)
[ 'broomstick' ]
SELECT id,orderId,product,amount FROM orderLine WHERE rowid IN (select last_insert_rowid())
select  orderLine.id as sorderLine0,orderLine.orderId as sorderLine1,orderLine.product as sorderLine2 from orderLine orderLine where orderLine.orderId in (2) order by orderLine.id
COMMIT
```
