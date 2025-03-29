import { RefObject } from 'react';

declare const useLazyRef: <T>(init: () => T) => RefObject<T>;

export { useLazyRef };
