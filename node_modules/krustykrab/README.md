# krustykrab

[![NPM](https://img.shields.io/npm/v/krustykrab.svg)](https://www.npmjs.com/package/krustykrab)
![dependencies status](https://img.shields.io/librariesio/release/npm/krustykrab)

Implementation of some helpers of `Rust` stdlib on `JavaScript/TypeScript`

[Api reference](https://vtaits.github.io/krustykrab/)

## Implemented helpers

### Option

```ts
import { Some, None } from "krustykrab";

const someOption = Some("foo");
const noneOption = None();
```

[Rust reference](https://doc.rust-lang.org/std/option/enum.Option.html)

[krustykrab reference](https://vtaits.github.io/krustykrab/types/Option.html)

### Result

```ts
import { Ok, Err } from "krustykrab";

const okResult = Ok("foo");
const errResult = Err("bar");
```

[Rust reference](https://doc.rust-lang.org/std/result/enum.Result.html)

[krustykrab reference](https://vtaits.github.io/krustykrab/types/Result.html)

## Additional helpers

### unwrap

Panics if the value is `null` or `undefined` or returns it otherwise

```ts
import { unwrap } from "krustykrab";

const fooOrUndefined = document.getElementById('foo'); // html element or `undefined`
const foo = unwrap(fooOrUndefined); // exactly html element
```

### unwrapOr

Returns the value if it's not `null` or `undefined`, or returns the default value

```ts
import { unwrapOr } from "krustykrab";

const foo: Partial<Record<string, string>> = { bar: 'baz' };

unwrapOr(foo.bar, 'qux'); // returns 'baz'
unwrapOr(foo.bat, 'qux'); // returns 'qux'
```

### unwrapOrElse

Returns the value if it's not `null` or `undefined`, or computes it

```ts
import { unwrapOrElse } from "krustykrab";

const foo: Partial<Record<string, string>> = { bar: 'baz' };

unwrapOrElse(foo.bar, () => 'qux'); // returns 'baz'
unwrapOrElse(foo.bat, () => 'qux'); // returns 'qux'
```

### getResult

Converts `Promise` to `Result`

```ts
import { getResult } from "krustykrab";

const successResult = await getResult(Promise.resolve('foo'));
successResult.unwrap(); // returns 'foo'

const errorResult = await getResult(Promise.reject('bar'));
errorResult.unwrapErr(); // returns 'bar'
```

### toOption

Convert a nullable variable to `Option`


```ts
import { toOption } from "krustykrab";

const option = toOption('foo');
option.isNone(); // returns `false`;
option.unwrap(); // returns `'foo'`;

toOption(null).isNone(); // returns `true`
toOption(undefined).isNone(); // returns `true`
```

### tryCatch

Wrap the result of a function call with `Result`

```ts
import { tryCatch } from "krustykrab";

const successResult = tryCatch(() => JSON.parse('{"foo": "bar"}'));
successResult.unwrap(); // returns `{ foo: "bar" }`

const errorResult = tryCatch(() => JSON.parse("{invalid json}"));
errorResult.isErr(); // returns `true`
```