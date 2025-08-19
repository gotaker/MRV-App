// New API in jest-preset-angular 14+
// Prefer zoned environment for Angular tests
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv();

// (If you hit a version constraint, temporary fallback works:)
// import 'jest-preset-angular/setup-jest';
