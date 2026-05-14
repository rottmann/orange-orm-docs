# SQLite user-defined functions

You can register custom SQLite functions on the connection using `db.function(name, fn)`.

The `fn` argument is your user-defined callback:

- It is invoked by SQLite every time the SQL function is called.
- Callback arguments are positional and match the SQL call (for example, `my_fn(a, b)` maps to `(a, b)`).
- Return a SQLite-compatible scalar value (for example text, number, or `null`).
- Throwing inside the callback fails the SQL statement.

`db.function(...)` is sync-only in Node and Deno, but can be async or sync in Bun.

```js
import map from './map';
const db = map.sqlite('demo.db');

await db.function('add_prefix', (text, prefix) => `${prefix}${text}`);

const rows = await db.query(
  "select id, name, add_prefix(name, '[VIP] ') as prefixedName from customer"
);
```

If you need the function inside a transaction, register it within the transaction callback to ensure it is available on that connection.

```js
await db.transaction(async (db) => {
  await db.function('add_prefix', (text, prefix) => `${prefix}${text}`);
  return db.query(
    "select id, name, add_prefix(name, '[VIP] ') as prefixedName from customer"
  );
});
```

`db.function(...)` is available on direct SQLite connections (for example `map.sqlite(...)`) and not through `map.http(...)`.
