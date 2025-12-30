
import { useSyncExternalStore } from 'react';

/**
 * useService Hook - React 18/19 Compliance
 * Uses useSyncExternalStore for authoritative state synchronization.
 * The 3rd argument is omitted to prevent Error #306 in browser-only ESM contexts.
 */
export function useService<T>(
  service: { 
    subscribe: (fn: () => void) => () => void;
  }, 
  selector: () => T
): T {
  return useSyncExternalStore(
    service.subscribe,
    selector
  );
}
