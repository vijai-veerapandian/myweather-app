[![NPM](https://img.shields.io/npm/v/@vtaits/use-lazy-ref.svg)](https://www.npmjs.com/package/@vtaits/use-lazy-ref)

# @vtaits/use-lazy-ref

`React.useRef` with initialization callback

## Example

### Good

```typescript
import { useLazyRef } from '@vtaits/use-lazy-ref';

const ref = useLazyRef(() => getRefInitialValue());
```

1. No extra boilerplate.
2. Inferred type of ref.
3. Typescript knows that a value of ref cannot be `undefined` (if it's not a possible result of `getRefInitialValue`).

### Bad

```typescript
import { useRef } from 'react';

const ref = useRef<ValueType>();

if (!ref.current) {
  ref.current = getRefInitialValue();
}
```

1. Extra boilerplate.
2. Ref type must be set.
3. Typescript thinks value of ref can be `undefined`.
