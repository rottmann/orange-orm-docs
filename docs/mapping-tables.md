# Mapping tables

To define a mapping, you employ the `map()` method, linking your tables and columns to corresponding object properties. You provide a callback function that engages with a parameter representing a database table.

Each column within your database table is designated by using the `column()` method, in which you specify its name. This action generates a reference to a column object that enables you to articulate further column properties like its data type or if it serves as a primary key.

Relationships between tables can also be outlined. By using methods like `hasOne`, `hasMany`, and `references`, you can establish connections that reflect the relationships in your data schema.

In the example below, an `order` is linked to a `customer` reference, a `deliveryAddress`, and multiple `lines`. The hasMany and hasOne relations represents ownership - the tables `deliveryAddress` and `orderLine` are owned by the `order` table, and therefore, they contain the `orderId` column referring to their parent table, which is `order`.

The similar relationship exists between `orderLine` and `package` - hence the packages are owned by the `orderLine`.

Conversely, the `customer` table is independent and can exist without any knowledge of the `order` table. Therefore we say that the `order` table <i>references</i> the `customer` table - necessitating the existence of a `customerId` column in the `order` table.

<Badge type="info" text="📄 map.ts" />

```ts
import orange from 'orange-orm';

const map = orange.map(x => ({
  customer: x.table('customer').map(({ column }) => ({
    id: column('id').numeric().primary().notNullExceptInsert(),
    name: column('name').string(),
    balance: column('balance').numeric(),
    isActive: column('isActive').boolean(),
  })),

  order: x.table('_order').map(({ column }) => ({
    id: column('id').numeric().primary().notNullExceptInsert(),
    orderDate: column('orderDate').date().notNull(),
    customerId: column('customerId').numeric().notNullExceptInsert(),
  })),

  orderLine: x.table('orderLine').map(({ column }) => ({
    id: column('id').numeric().primary(),
    orderId: column('orderId').numeric(),
    product: column('product').string(),
  })),

  package: x.table('package').map(({ column }) => ({
    id: column('packageId').numeric().primary().notNullExceptInsert(),
    lineId: column('lineId').numeric().notNullExceptInsert(),
    sscc: column('sscc').string() //the barcode
  })),

  deliveryAddress: x.table('deliveryAddress').map(({ column }) => ({
    id: column('id').numeric().primary(),
    orderId: column('orderId').numeric(),
    name: column('name').string(),
    street: column('street').string(),
    postalCode: column('postalCode').string(),
    postalPlace: column('postalPlace').string(),
    countryCode: column('countryCode').string().enum(['NO', 'SE', 'DK', 'FI', 'IS', 'DE', 'FR', 'NL', 'ES', 'IT']),
  }))

})).map(x => ({
  orderLine: x.orderLine.map(({ hasMany }) => ({
    packages: hasMany(x.package).by('lineId')
  })),
  order: x.order.map(({ hasOne, hasMany, references }) => ({
    customer: references(x.customer).by('customerId'),
    deliveryAddress: hasOne(x.deliveryAddress).by('orderId'),
    lines: hasMany(x.orderLine).by('orderId')
  }))
}));

export default map;
```

The `init.ts` script resets our SQLite database. It's worth noting that SQLite databases are represented as single files, which makes them wonderfully straightforward to manage.

At the start of the script, we import our database mapping from the `map.ts` file. This gives us access to the db object, which we'll use to interact with our SQLite database.

Then, we define a SQL string. This string outlines the structure of our SQLite database. It first specifies to drop existing tables named `deliveryAddress`, `package`, `orderLine`, `_order`, and `customer` if they exist. This ensures we have a clean slate. Then, it dictates how to create these tables anew with the necessary columns and constraints.

Because of a peculiarity in SQLite, which only allows one statement execution at a time, we split this SQL string into separate statements. We do this using the `split()` method, which breaks up the string at every semicolon.

<Badge type="info" text="📄 init.ts" />

```ts
import map from './map';
const db = map.sqlite('demo.db');

const sql = `DROP TABLE IF EXISTS deliveryAddress;
DROP TABLE IF EXISTS package;
DROP TABLE IF EXISTS orderLine;
DROP TABLE IF EXISTS _order;
DROP TABLE IF EXISTS customer;

CREATE TABLE customer (
    id INTEGER PRIMARY KEY,
    name TEXT,
    balance NUMERIC,
    isActive INTEGER
);

CREATE TABLE _order (
    id INTEGER PRIMARY KEY,
    orderDate TEXT,
    customerId INTEGER REFERENCES customer
);

CREATE TABLE orderLine (
    id INTEGER PRIMARY KEY,
    orderId INTEGER REFERENCES _order,
    product TEXT,
    amount NUMERIC(10,2)
);

CREATE TABLE package (
    packageId INTEGER PRIMARY KEY,
    lineId INTEGER REFERENCES orderLine,
    sscc TEXT
);

CREATE TABLE deliveryAddress (
    id INTEGER PRIMARY KEY,
    orderId INTEGER REFERENCES _order,
    name TEXT,
    street TEXT,
    postalCode TEXT,
    postalPlace TEXT,
    countryCode TEXT
)
`;


async function init() {
  const statements = sql.split(';');
  for (let i = 0; i < statements.length; i++) {
    await db.query(statements[i]);
  }
}
export default init;
```

In SQLite, columns with the `INTEGER PRIMARY KEY` attribute are designed to autoincrement by default. This means that each time a new record is inserted into the table, SQLite automatically produces a numeric key for the id column that is one greater than the largest existing key. This mechanism is particularly handy when you want to create unique identifiers for your table rows without manually entering each id.
