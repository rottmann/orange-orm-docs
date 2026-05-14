---
url: /orange-orm-docs/column-discriminators.md
---
# Column discriminators

Column discriminators are used to distinguish between different types of data in the same table. Think of them as labels that identify whether a record is one category or another.\
In the example, the `client_type` column serves as the discriminator that labels records as `customer` or `vendor` in the `client` table.\
On inserts, the column will automatically be given the correct discriminator value. Similarly, when fetching and deleting, the discrimiminator will be added to the WHERE clause.

```js
import orange from 'orange-orm';

const map = orange.map(x => ({
  customer: x.table('client').map(({ column }) => ({
    id: column('id').numeric().primary(),
    name: column('name').string()
  })).columnDiscriminators(`client_type='customer'`),

  vendor: x.table('client').map(({ column }) => ({
    id: column('id').numeric().primary(),
    name: column('name').string()
  })).columnDiscriminators(`client_type='vendor'`),
}));

export default map;
```
