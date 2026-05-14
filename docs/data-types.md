# Data types

<span v-html="$projectName"></span> is database agnostic - meaning it can work with multiple database systems without being specifically tied to any one of them. When the ORM behaves consistently across various databases, developers don't need to remember specific quirks or differences when switching between databases. They can rely on the ORM to provide the same mapping behavior, which reduces the cognitive load and potential for errors. There are currently 8 column types in Orange:

- **`string`** maps to VARCHAR or TEXT in sql
- **`numeric`** maps to INTEGER, DECIMAL, NUMERIC, TINYINT FLOAT/REAL or DOUBLE in sql.
- **`bigint`** maps to INTEGER, BIGINT in sql.
- **`boolean`** maps to BIT, TINYINT(1) or INTEGER in sql.
- **`uuid`** is represented as string in javascript and maps to UUID, GUID or VARCHAR in sql.
- **`date`** is represented as ISO 8601 string  in javascript and maps to DATE, DATETIME, TIMESTAMP or DAY in sql. Representing datetime values as ISO 8601 strings, rather than relying on JavaScript's native Date object, has multiple advantages, especially when dealing with databases and servers in different time zones. The datetime values are inherently accompanied by their respective time zones. This ensures that the datetime value remains consistent regardless of where it's being viewed or interpreted. On the other hand, JavaScript's Date object is typically tied to the time zone of the environment in which it's executed, which could lead to inconsistencies between the client and the database server.
- **`dateWithTimeZone`** is represented as ISO 8601 string  in javascript and maps to TIMESTAMP WITH TIME ZONE in postgres and DATETIMEOFFSET in ms sql.\
  Contrary to what its name might imply, timestamptz (TIMESTAMP WITH TIME ZONE) in postgres doesn't store the time zone data. Instead, it adjusts the provided time value to UTC (Coordinated Universal Time) before storing it. When a timestamptz value is retrieved, PostgreSQL will automatically adjust the date-time to the time zone setting of the PostgreSQL session (often the server's timezone, unless changed by the user). The primary benefit of DATETIMEOFFSET in ms sql is its ability to keep track of the time zone context. If you're dealing with global applications where understanding the original time zone context is critical (like for coordinating meetings across time zones or logging events), DATETIMEOFFSET is incredibly valuable.
- **`binary`** is represented as a base64 string in javascript and maps to BLOB, BYTEA or VARBINARY(max) in sql.
- **`json`** and **`jsonOf<T>`** are represented as an object or array in javascript and maps to JSON, JSONB, NVARCHAR(max) or TEXT (sqlite) in sql.

<Badge type="info" text="📄 map.ts" />

```ts
import orange from 'orange-orm';

interface Pet {
    name: string;
    kind: string;
}

const map = orange.map(x => ({
    demo: x.table('demo').map(x => ({
      id: x.column('id').uuid().primary().notNull(),
      name: x.column('name').string(),
      balance: x.column('balance').numeric(),
      discordId: x.column('balance').bigint(),
      regularDate: x.column('regularDate').date(),
      tzDate: x.column('tzDate').dateWithTimeZone(),
      picture: x.column('picture').binary(),
      pet: x.column('pet').jsonOf<Pet>(), //generic
      pet2: x.column('pet2').json(), //non-generic
  }))
}));
```

<Badge type="info" text="📄 map.js" />

```js
import orange from 'orange-orm';

/**
 * @typedef {Object} Pet
 * @property {string} name - The name of the pet.
 * @property {string} kind - The kind of pet
 */

/** @type {Pet} */
let pet;

const map = orange.map(x => ({
    demo: x.table('demo').map(x => ({
      id: x.column('id').uuid().primary().notNull(),
      name: x.column('name').string(),
      balance: x.column('balance').numeric(),
      regularDate: x.column('regularDate').date(),
      tzDate: x.column('tzDate').dateWithTimeZone(),
      picture: x.column('picture').binary(),
      pet: x.column('pet').jsonOf(pet), //generic
      pet2: x.column('pet2').json(), //non-generic
  }))
}));
```
