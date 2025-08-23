import { MediaMatcher } from './chunk-WIFQLOXE.js';
import {
  ANIMATION_MODULE_TYPE,
  NgModule,
  setClassMetadata,
  ɵɵdefineNgModule,
} from './chunk-CN63QFYK.js';
import { InjectionToken, inject, ɵɵdefineInjector } from './chunk-23AQOG4C.js';

// node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule = class _LayoutModule {
  static ɵfac = function LayoutModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _LayoutModule,
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === 'undefined' || ngDevMode) &&
    setClassMetadata(
      LayoutModule,
      [
        {
          type: NgModule,
          args: [{}],
        },
      ],
      null,
      null,
    );
})();

// node_modules/@angular/material/fesm2022/animation-ChQ1vjiF.mjs
var MATERIAL_ANIMATIONS = new InjectionToken('MATERIAL_ANIMATIONS');
var reducedMotion = null;
function _getAnimationsState() {
  if (
    inject(MATERIAL_ANIMATIONS, { optional: true })?.animationsDisabled ||
    inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations'
  ) {
    return 'di-disabled';
  }
  reducedMotion ??= inject(MediaMatcher).matchMedia('(prefers-reduced-motion)').matches;
  return reducedMotion ? 'reduced-motion' : 'enabled';
}
function _animationsDisabled() {
  return _getAnimationsState() !== 'enabled';
}

// node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceBooleanProperty(value) {
  return value != null && `${value}` !== 'false';
}

export { _animationsDisabled, coerceBooleanProperty };
//# sourceMappingURL=chunk-JZDUZI2O.js.map
