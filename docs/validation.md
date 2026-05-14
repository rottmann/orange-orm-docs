# Validation

In the previous sections you have already seen the `notNull()` validator being used on some columns. This will not only generate correct typescript mapping, but also throw an error if value is set to null or undefined.\
However, sometimes we do not want the notNull-validator to be run on inserts. Typically, when we have an autoincremental key or server generated uuid, it does not make sense to check for null on insert. This is where `notNullExceptInsert()` comes to rescue. You can also create your own custom validator as shown below.\
The last kind of validator, is the [ajv JSON schema validator](https://ajv.js.org/json-schema.html). This can be used on json columns as well as any other column type.

Custom validators receive `value` and a metadata object with `table`, `column`, `property`, and `isInsert`.

<Badge type="info" text="📄 map.ts" />

```ts
import orange from 'orange-orm';

interface Pet {
    name: string;
    kind: string;
}

let petSchema = {
    "properties": {
        "name": { "type": "string" },
        "kind": { "type": "string" }
    }
};

function validateName(value?: string, meta: { table: string; column: string; property: string; isInsert: boolean }) {
  if (value && value.length > 10)
    throw new Error(`Length cannot exceed 10 characters in ${meta.table}.${meta.column}`);
}

const map = orange.map(x => ({
    demo: x.table('demo').map(x => ({
      id: x.column('id').uuid().primary().notNullExceptInsert(),
      name: x.column('name').string().validate(validateName),
      pet: x.column('pet').jsonOf<Pet>().JSONSchema(petSchema)
  }))
}));

export default map;
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

let petSchema = {
    "properties": {
        "name": { "type": "string" },
        "kind": { "type": "string" }
    }
};

function validateName(value, meta) {
  if (value && value.length > 10)
    throw new Error(`Length cannot exceed 10 characters in ${meta.table}.${meta.column}`);
}

const map = orange.map(x => ({
    demo: x.table('demo').map(x => ({
      id: x.column('id').uuid().primary().notNullExceptInsert(),
      name: x.column('name').string().validate(validateName),
      pet: x.column('pet').jsonOf(pet).JSONSchema(petSchema)
  }))
}));

export default map;
```
