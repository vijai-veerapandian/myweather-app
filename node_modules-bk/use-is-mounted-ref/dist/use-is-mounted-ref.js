(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.useIsMountedRef = {}, global.React));
})(this, (function (exports, react) { 'use strict';

  function useIsMountedRef() {
      var isMountedRef = react.useRef(false);
      react.useEffect(function () {
          isMountedRef.current = true;
          return function () {
              isMountedRef.current = false;
          };
      }, []);
      return isMountedRef;
  }

  exports["default"] = useIsMountedRef;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
