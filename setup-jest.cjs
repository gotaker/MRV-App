// setup-jest.cjs
// Modern Zone.js-based test env for jest-preset-angular
const { setupZoneTestEnv } = require('jest-preset-angular/setup-env/zone');
setupZoneTestEnv();

// (Optional) light DOM/CSS shims to quiet some libs:
globalThis.CSS ||= { supports: () => false };
if (!globalThis.matchMedia) {
  globalThis.matchMedia = () => ({
    matches: false, media: '', onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
  });
}
