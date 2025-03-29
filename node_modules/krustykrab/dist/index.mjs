// src/option_result.ts
function Ok(result) {
  const self = {
    isOk: () => true,
    isOkAnd: (fn) => fn(result),
    isErr: () => false,
    isErrAnd: () => false,
    ok: () => Some(result),
    err: () => None(),
    map: (fn) => Ok(fn(result)),
    mapOr: (_, fn) => fn(result),
    mapOrElse: (_, fn) => fn(result),
    mapErr: () => Ok(result),
    expect: () => result,
    expectErr: (msg) => {
      throw new Error(msg);
    },
    unwrap: () => result,
    unwrapErr: () => {
      throw new Error(`${result}`);
    },
    unwrapOr: () => result,
    unwrapOrElse: () => result,
    and: (res) => res,
    andThen: (getRes) => getRes(result),
    or: () => Ok(result),
    orElse: () => Ok(result)
  };
  return self;
}
function Err(err) {
  const self = {
    isOk: () => false,
    isOkAnd: () => false,
    isErr: () => true,
    isErrAnd: (fn) => fn(err),
    ok: () => None(),
    err: () => Some(err),
    map: () => Err(err),
    mapOr: (defaultValue) => defaultValue,
    mapOrElse: (getDefaultValue) => getDefaultValue(err),
    mapErr: (fn) => Err(fn(err)),
    expect: (msg) => {
      throw new Error(msg);
    },
    expectErr: () => err,
    unwrap: () => {
      throw new Error(`${err}`);
    },
    unwrapErr: () => err,
    unwrapOr: (defaultValue) => defaultValue,
    unwrapOrElse: (getDefaultValue) => getDefaultValue(err),
    and: () => Err(err),
    andThen: () => Err(err),
    or: (res) => res,
    orElse: (getRes) => getRes(err)
  };
  return self;
}
function None() {
  const self = {
    and: () => None(),
    andThen: () => None(),
    expect: (msg) => {
      throw new Error(msg);
    },
    filter: () => self,
    isSome: () => false,
    isSomeAnd: () => false,
    isNone: () => true,
    map: () => None(),
    mapOr: (defaultValue) => defaultValue,
    mapOrElse: (getDefaultValue) => getDefaultValue(),
    okOr: (err) => Err(err),
    okOrElse: (getErr) => Err(getErr()),
    or: (opt) => opt,
    orElse: (fn) => fn(),
    unwrap: () => {
      throw new Error("panic! call `unwrap` on a `None` value");
    },
    unwrapOr: (defaultValue) => defaultValue,
    unwrapOrElse: (getDefaultValue) => getDefaultValue(),
    xor: (opt) => {
      if (opt.isSome()) {
        return opt;
      }
      return self;
    }
  };
  return self;
}
function Some(value) {
  const self = {
    and: (opt) => opt,
    andThen: (fn) => fn(value),
    expect: () => value,
    filter: (fn) => {
      if (fn(value)) {
        return self;
      }
      return None();
    },
    isSome: () => true,
    isSomeAnd: (fn) => fn(value),
    isNone: () => false,
    map: (fn) => Some(fn(value)),
    mapOr: (_, fn) => fn(value),
    mapOrElse: (_, fn) => fn(value),
    okOr: () => Ok(value),
    okOrElse: () => Ok(value),
    or: () => self,
    orElse: () => self,
    unwrap: () => value,
    unwrapOr: () => value,
    unwrapOrElse: () => value,
    xor: (opt) => {
      if (opt.isNone()) {
        return self;
      }
      return None();
    }
  };
  return self;
}

// src/to_option.ts
function toOption(arg) {
  if (arg === null || arg === void 0) {
    return None();
  }
  return Some(arg);
}

// src/get_result.ts
function getResult(promise) {
  return promise.then(
    (response) => Ok(response),
    (err) => Err(err)
  );
}

// src/unwrap.ts
function unwrap(value) {
  if (value === null || value === void 0) {
    throw new Error(`panic! call \`unwrap\` on a \`${value}\` value`);
  }
  return value;
}

// src/unwrap_or.ts
function unwrapOr(value, defaultValue) {
  if (value === null || value === void 0) {
    return defaultValue;
  }
  return value;
}

// src/unwrap_or_else.ts
function unwrapOrElse(value, getDefaultValue) {
  if (value === null || value === void 0) {
    return getDefaultValue();
  }
  return value;
}

// src/try_catch.ts
function tryCatch(fn) {
  let result;
  try {
    result = fn();
  } catch (e) {
    return Err(e);
  }
  return Ok(result);
}
export {
  Err,
  None,
  Ok,
  Some,
  getResult,
  toOption,
  tryCatch,
  unwrap,
  unwrapOr,
  unwrapOrElse
};
//# sourceMappingURL=index.mjs.map