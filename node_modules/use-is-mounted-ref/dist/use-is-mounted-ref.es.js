import { useRef, useEffect } from 'react';

function useIsMountedRef() {
    var isMountedRef = useRef(false);
    useEffect(function () {
        isMountedRef.current = true;
        return function () {
            isMountedRef.current = false;
        };
    }, []);
    return isMountedRef;
}

export { useIsMountedRef as default };
//# sourceMappingURL=use-is-mounted-ref.es.js.map
