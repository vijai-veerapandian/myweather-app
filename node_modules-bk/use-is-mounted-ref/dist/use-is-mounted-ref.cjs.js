'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

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
//# sourceMappingURL=use-is-mounted-ref.cjs.js.map
