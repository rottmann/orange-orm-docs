# Excluding sensitive data

To secure your application by preventing sensitive data from being serialized and possibly leaked, you can use the `serializable(false)` attribute on certain fields within your database schema. Here, the `serializable(false)` attribute has been applied to the balance column, indicating that this field will not be serialized when a record is converted to a JSON string.

<Badge type="info" text="📄 map.ts" />

```ts
import orange from 'orange-orm';

const map = orange.map(x => ({
  customer: x.table('customer').map(({ column }) => ({
    id: column('id').numeric().primary().notNullExceptInsert(),
    name: column('name').string(),
    balance: column('balance').numeric().serializable(false),
    isActive: column('isActive').boolean(),
  }))
}));

export default map;
```

<Badge type="info" text="📄 sensitive.ts" />

```ts
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {

  const george = await db.customer.insert({
    name: 'George',
    balance: 177,
    isActive: true
  });

  console.dir(JSON.stringify(george), {depth: Infinity});
  //note that balance is excluded:
  //'{"id":1,"name":"George","isActive":true}'
}
```
