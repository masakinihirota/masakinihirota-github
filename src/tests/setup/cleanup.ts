// Lightweight test cleanup registry
// Tests can register async cleanup functions which will be executed after each test

let cleanupFns: Array<() => Promise<void>> = [];

export function registerCleanup(fn: () => Promise<void> | void) {
  cleanupFns.push(() => Promise.resolve(fn()));
}

export async function runAndResetCleanups() {
  // Execute in reverse order (LIFO) so creation/cleanup pairs work naturally
  for (let i = cleanupFns.length - 1; i >= 0; i--) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await cleanupFns[i]();
    } catch (e) {
      // swallow cleanup errors (tests should still surface failures)
      // but log for diagnostics
      // eslint-disable-next-line no-console
      console.warn('cleanup error', e);
    }
  }

  cleanupFns = [];
}

export function resetCleanupRegistry() {
  cleanupFns = [];
}

export default { registerCleanup, runAndResetCleanups, resetCleanupRegistry };
