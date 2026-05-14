---
url: /orange-orm-docs/raw-sql-queries.md
---
# Raw sql queries

You can employ raw SQL queries directly to fetch rows from the database, bypassing the ORM (Object-Relational Mapper). It is important to note that due to security precautions aimed at preventing SQL injection attacks, using raw SQL filters directly via browser inputs is not allowed. Attempting to do so will result in an HTTP status 403 (Forbidden) being returned.

```js
import map from './map';
const db = map.sqlite('demo.db');

getRows();

async function getRows() {
  const query = {
    sql: 'select * from customer where name like ?',
    parameters: ['%arry']
  };

  const rows = await db.query(query)
}
```
