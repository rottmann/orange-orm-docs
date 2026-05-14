# Enums

Enums can be defined using object literals, arrays, or TypeScript enums. The `enum()` method uses literal types when possible, so prefer patterns that keep literals (inline objects, `as const`, or `Object.freeze` in JS).

<Badge type="info" text="📄 map.ts (TypeScript enum)" />

```ts
enum CountryCode {
  NORWAY = 'NO',
  SWEDEN = 'SE',
  DENMARK = 'DK',
  FINLAND = 'FI',
  ICELAND = 'IS',
  GERMANY = 'DE',
  FRANCE = 'FR',
  NETHERLANDS = 'NL',
  SPAIN = 'ES',
  ITALY = 'IT',
}

const map = orange.map(x => ({
  deliveryAddress: x.table('deliveryAddress').map(({ column }) => ({
    id: column('id').numeric().primary(),
    name: column('name').string(),
    street: column('street').string(),
    postalCode: column('postalCode').string(),
    postalPlace: column('postalPlace').string(),
    countryCode: column('countryCode').string().enum(CountryCode),
  }))
}));
```

<Badge type="info" text="📄 map.ts (as const)" />

```ts
const Countries = {
  NORWAY: 'NO',
  SWEDEN: 'SE',
  DENMARK: 'DK',
  FINLAND: 'FI',
  ICELAND: 'IS',
  GERMANY: 'DE',
  FRANCE: 'FR',
  NETHERLANDS: 'NL',
  SPAIN: 'ES',
  ITALY: 'IT',
} as const;

const map = orange.map(x => ({
  deliveryAddress: x.table('deliveryAddress').map(({ column }) => ({
    id: column('id').numeric().primary(),
    name: column('name').string(),
    street: column('street').string(),
    postalCode: column('postalCode').string(),
    postalPlace: column('postalPlace').string(),
    countryCode: column('countryCode').string().enum(Countries),
  }))
}));
```

<Badge type="info" text="📄 map.ts (array)" />

```ts
const map = orange.map(x => ({
  deliveryAddress: x.table('deliveryAddress').map(({ column }) => ({
    id: column('id').numeric().primary(),
    name: column('name').string(),
    street: column('street').string(),
    postalCode: column('postalCode').string(),
    postalPlace: column('postalPlace').string(),
    countryCode: column('countryCode').string().enum(
      ['NO', 'SE', 'DK', 'FI', 'IS', 'DE', 'FR', 'NL', 'ES', 'IT']
    ),
  }))
}));
```

<Badge type="info" text="📄 map.ts (literal object)" />

```ts
const map = orange.map(x => ({
  deliveryAddress: x.table('deliveryAddress').map(({ column }) => ({
    id: column('id').numeric().primary(),
    name: column('name').string(),
    street: column('street').string(),
    postalCode: column('postalCode').string(),
    postalPlace: column('postalPlace').string(),
    countryCode: column('countryCode').string().enum({
      NORWAY: 'NO',
      SWEDEN: 'SE',
      DENMARK: 'DK',
      FINLAND: 'FI',
      ICELAND: 'IS',
      GERMANY: 'DE',
      FRANCE: 'FR',
      NETHERLANDS: 'NL',
      SPAIN: 'ES',
      ITALY: 'IT',
    }),
  }))
}));
```

<Badge type="info" text="📄 map.js (Object.freeze)" />

```js
const Countries = Object.freeze({
  NORWAY: 'NO',
  SWEDEN: 'SE',
  DENMARK: 'DK',
  FINLAND: 'FI',
  ICELAND: 'IS',
  GERMANY: 'DE',
  FRANCE: 'FR',
  NETHERLANDS: 'NL',
  SPAIN: 'ES',
  ITALY: 'IT',
});

const map = orange.map(x => ({
  deliveryAddress: x.table('deliveryAddress').map(({ column }) => ({
    id: column('id').numeric().primary(),
    name: column('name').string(),
    street: column('street').string(),
    postalCode: column('postalCode').string(),
    postalPlace: column('postalPlace').string(),
    countryCode: column('countryCode').string().enum(Countries),
  }))
}));
```
