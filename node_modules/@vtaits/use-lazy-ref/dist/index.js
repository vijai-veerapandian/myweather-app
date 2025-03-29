// src/index.ts
import { useRef } from "react";
var EMPTY_VALUE = Symbol("useLazyRef empty value");
var useLazyRef = (init) => {
  const resultRef = useRef(EMPTY_VALUE);
  if (resultRef.current === EMPTY_VALUE) {
    resultRef.current = init();
  }
  return resultRef;
};
export {
  useLazyRef
};
//# sourceMappingURL=index.js.map