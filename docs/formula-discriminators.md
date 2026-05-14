# Formula discriminators

Formula discriminators are used to distinguish between different types of data in the same table. They differ from column discriminators by using a logical expression rather than a static value in a column.

In the example below, the formula discriminator categorize bookings into `customerBooking` and `internalBooking` within the same `booking` table. The categorization is based on the value of the `booking_no` column. For `customerBooking`, records are identified where the booking number falls within the range of 10000 to 99999. For `internalBooking`, the range is between 1000 to 9999. These conditions are utilized during fetch and delete operations to ensure that the program interacts with the appropriate subset of records according to their booking number. Unlike column discriminators, formula discriminators are not used during insert operations since they rely on existing data to evaluate the condition.

The `@this` acts as a placeholder within the formula. When <span v-html="$projectName"></span> constructs a query, it replaces `@this` with the appropriate alias for the table being queried. This replacement is crucial to avoid ambiguity, especially when dealing with joins with ambigious column names.

```js
import orange from 'orange-orm';

const map = orange.map(x => ({
  customerBooking: x.table('booking').map(({ column }) => ({
    id: column('id').uuid().primary(),
    bookingNo: column('booking_no').numeric()
  })).formulaDiscriminators('@this.booking_no between 10000 and 99999'),

  internalBooking: x.table('booking').map(({ column }) => ({
    id: column('id').uuid().primary(),
    bookingNo: column('booking_no').numeric()
  })).formulaDiscriminators('@this.booking_no between 1000 and 9999'),
}));

export default map;
```
