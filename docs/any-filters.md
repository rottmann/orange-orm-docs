# Any, all, none

These operators are used in scenarios involving relationships within database records.

## Any

The `any` operator is employed when the objective is to find records where at least one item in a collection meets the specified criteria.

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: y => y.lines.any(x => x.product.contains('guitar'))
    //equivalent syntax:
    //where: x => x.lines.product.contains('guitar')
  });
}
```

## All

Conversely, the `all` operator ensures that every item in a collection adheres to the defined condition.

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: y => y.lines.all(x => x.product.contains('a'))
  });
}
```

## None

The `none` operator, as the name suggests, is used to select records where not a single item in a collection meets the condition.

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: y => y.lines.none(x => x.product.equal('Magic wand'))
  });
}
```

## Count

Use `count` on a relation in a filter to compare how many related rows match a condition.

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const rows = await db.order.getMany({
    where: x => x.lines.count().le(1)
      .and(x.lines.count(line => line.product.contains('guitar')).eq(1))
  });
}
```
