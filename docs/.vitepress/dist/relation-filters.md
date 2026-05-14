---
url: /orange-orm-docs/relation-filters.md
---
# Relation filters

Relation filters offer a dynamic approach to selectively include or exclude related data based on specific criteria. In the provided example, all orders are retrieved, yet it filters the order lines to only include those that feature products with `broomstick` in their description.\
By setting `deliveryAddress` and `customer` to `true`, we also ensure the inclusion of these related entities in our result set.

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const orders = await db.order.getMany({
    lines: {
      where: x => x.product.contains('broomstick')
    },
    deliveryAddress: true,
    customer: true
  });
}
```
