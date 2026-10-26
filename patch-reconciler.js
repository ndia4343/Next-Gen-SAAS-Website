const fs = require('fs');

// Patch production bundle
const prodPath = 'node_modules/react-reconciler/cjs/react-reconciler.production.min.js';
if (fs.existsSync(prodPath)) {
  let prod = fs.readFileSync(prodPath, 'utf8');

  // 1. Internals patch
  if (prod.includes('__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED')) {
    prod = prod.replace(
      /var ea=aa\.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED[^;]*/,
      'var ea=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED||aa.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE||{};if(!ea.ReactCurrentDispatcher){ea.ReactCurrentDispatcher={get current(){return ea.H},set current(v){ea.H=v}}};if(!ea.ReactCurrentBatchConfig)ea.ReactCurrentBatchConfig={transition:null};if(!ea.ReactCurrentOwner)ea.ReactCurrentOwner={current:null};if(!ea.ReactCurrentActQueue)ea.ReactCurrentActQueue={current:null}'
    );
  }

  // 2. React 19 Transitional Element Symbol patch
  prod = prod.replaceAll('Symbol.for("react.element")', 'Symbol.for("react.transitional.element")');

  fs.writeFileSync(prodPath, prod);
  console.log('Successfully verified/patched react-reconciler production bundle!');
}

// Patch development bundle
const devPath = 'node_modules/react-reconciler/cjs/react-reconciler.development.js';
if (fs.existsSync(devPath)) {
  let dev = fs.readFileSync(devPath, 'utf8');

  const targetDev = 'var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;';
  const replacementDev = 'var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED || React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE || {}; if (!ReactSharedInternals.ReactCurrentDispatcher) { ReactSharedInternals.ReactCurrentDispatcher = { get current() { return ReactSharedInternals.H; }, set current(v) { ReactSharedInternals.H = v; } }; } if (!ReactSharedInternals.ReactCurrentBatchConfig) ReactSharedInternals.ReactCurrentBatchConfig = { transition: null }; if (!ReactSharedInternals.ReactCurrentOwner) ReactSharedInternals.ReactCurrentOwner = { current: null }; if (!ReactSharedInternals.ReactCurrentActQueue) ReactSharedInternals.ReactCurrentActQueue = { current: null }; if (!ReactSharedInternals.ReactDebugCurrentFrame) ReactSharedInternals.ReactDebugCurrentFrame = { getStackAddendum: function() { return ""; } };';

  if (dev.includes(targetDev)) {
    dev = dev.replace(targetDev, replacementDev);
  }

  dev = dev.replaceAll("Symbol.for('react.element')", "Symbol.for('react.transitional.element')");

  fs.writeFileSync(devPath, dev);
  console.log('Successfully verified/patched react-reconciler development bundle!');
}
