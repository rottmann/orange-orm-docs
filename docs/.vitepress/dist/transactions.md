---
url: /orange-orm-docs/transactions.md
---
# Transactions

We initiate a database transaction using db.transaction.
Within the transaction, a customer is retrieved and its balance updated using the tx object to ensure operations are transactional.
An error is deliberately thrown to demonstrate a rollback, ensuring all previous changes within the transaction are reverted.
Always use the provided tx object for operations within the transaction to maintain data integrity.

> \[!important] NOTE: Transactions are not supported for Cloudflare D1

```js
import map from './map';
const db = map.sqlite('demo.db');

execute();

async function execute() {
  await db.transaction(async tx => {
    const customer = await tx.customer.getById(1);
    customer.balance = 100;
    await customer.saveChanges();
    throw new Error('This will rollback');
  });
}

```
