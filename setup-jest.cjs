const { setupZoneTestEnv } = require('jest-preset-angular/setup-env/zone');
setupZoneTestEnv();

// Optional DOM shims used by some libs in tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    media: query,
    matches: false,
    onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
  }),
});
