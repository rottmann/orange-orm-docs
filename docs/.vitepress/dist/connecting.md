---
url: /orange-orm-docs/connecting.md
---
# Connecting

## SQLite

When running **Node.js 21 and earlier**, you need to install the `sqlite3` dependency.
When running Node.js 22 and later, Bun, or Deno,  you don't need it as it is built-in.

```bash
npm install sqlite3
```

```js
import map from './map';
const db = map.sqlite('demo.db');
// … use the database …

// IMPORTANT for serverless functions:
await db.close();           // closes the client connection
```

### With connection pool

```bash
npm install sqlite3
```

```js
import map from './map';
const db = map.sqlite('demo.db', { size: 10 });
// … use the pool …

// IMPORTANT for serverless functions:
await pool.close();         // closes all pooled connections
```

#### Why close ?

In serverless environments (e.g. AWS Lambda, Vercel, Cloudflare Workers) execution contexts are frequently frozen and resumed. Explicitly closing the client or pool ensures that file handles are released promptly and prevents “database locked” errors between invocations.

#### SQLite user-defined functions

You can register custom SQLite functions using `db.function(name, fn)`.
For full behavior, runtime caveats, and examples, see [SQLite user-defined functions](./sqlite-user-defined-functions).

## From the browser

You can securely use  from the browser by utilizing the Express plugin, which serves to safeguard sensitive database credentials from exposure at the client level. This technique bypasses the need to transmit raw SQL queries directly from the client to the server. Instead, it logs method calls initiated by the client, which are later replayed and authenticated on the server. This not only reinforces security by preventing the disclosure of raw SQL queries on the client side but also facilitates a smoother operation. Essentially, this method mirrors a traditional REST API, augmented with advanced TypeScript tooling for enhanced functionality.\
You can read more about it in the section called [In the browser](./in-the-browser)

```ts
import map from './map';
import { json } from 'body-parser';
import express from 'express';
import cors from 'cors';

const db = map.sqlite('demo.db');

express().disable('x-powered-by')
  .use(json({ limit: '100mb' }))
  .use(cors())
  //for demonstrational purposes, authentication middleware is not shown here.
  .use('/orange', db.express())
  .listen(3000, () => console.log('Example app listening on port 3000!'));
```

```ts
import map from './map';

const db = map.http('http://localhost:3000/orange');
```

## MySQL

```bash
npm install mysql2
```

```js
import map from './map';
const db = map.mysql('mysql://test:test@mysql/test');
```

## MariaDB

```bash
npm install mysql2
```

```js
import map from './map';
const db = map.mariadb('mariadb://test:test@mariadb/test');
```

## MS SQL

```bash
npm install tedious
```

```js
import map from './map';
const db = map.mssql({
          server: 'mssql',
          options: {
            encrypt: false,
            database: 'test'
          },
          authentication: {
            type: 'default',
            options: {
              userName: 'sa',
              password: 'P@assword123',
            }
          }
        });
```

## PostgreSQL

With Bun, you don't need to install the `pg` package as PostgreSQL support is built-in.

```bash
npm install pg
```

```js
import map from './map';
const db = map.postgres('postgres://postgres:postgres@postgres/postgres');
```

### With schema

```js
import map from './map';
const db = map.postgres('postgres://postgres:postgres@postgres/postgres?search_path=custom');
```

## PGlite

```bash
npm install @electric-sql/pglite
```

In this example we use the in-memory Postgres.
Read more about [PGLite connection configs](https://pglite.dev/docs/).

```js
import map from './map';
const db = map.pglite( /* config? : PGliteOptions */);
```

## Cloudflare D1

```toml
name = "d1-tutorial"
main = "src/index.ts"
compatibility_date = "2025-02-04"

# Bind a D1 database. D1 is Cloudflare’s native serverless SQL database.
# Docs: https://developers.cloudflare.com/workers/wrangler/configuration/#d1-databases
[[d1_databases]]
binding = "DB"
database_name = "<your-name-for-the-database>"
database_id = "<your-guid-for-the-database>"
```

```ts
import map from './map';

export interface Env {
  // Must match the binding name in wrangler.toml
  DB: D1Database;
}

export default {
  async fetch(request, env): Promise<Response> {
    const db = map.d1(env.DB);
    const customers = await db.customer.getMany();
    return Response.json(customers);
  },
} satisfies ExportedHandler<Env>;
```

## Oracle

```bash
npm install oracledb
```

```js
import map from './map';
const db = map.oracle({
  user: 'sys',
  password: 'P@assword123',
  connectString: 'oracle/XE',
  privilege: 2
});
```

## SAP Adaptive Server

Even though msnodesqlv8 was developed for MS SQL, it also works for SAP ASE as it is ODBC compliant.

```bash
npm install msnodesqlv8
```

```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import map from './map';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//download odbc driver from sap web pages
const db = map.sap(`Driver=${__dirname}/libsybdrvodb.so;SERVER=sapase;Port=5000;UID=sa;PWD=sybase;DATABASE=test`);

```
