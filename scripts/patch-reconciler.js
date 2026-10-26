const fs = require('fs');
const path = require('path');

function findTargetFiles(dir) {
  let files = [];
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === '.git') continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files = files.concat(findTargetFiles(fullPath));
      } else if (
        item.startsWith('react-reconciler') && item.endsWith('.js')
      ) {
        files.push(fullPath);
      }
    }
  } catch (err) {}
  return files;
}

const nodeModulesDir = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesDir)) {
  console.log('node_modules not found, skipping patch.');
  process.exit(0);
}

const targetFiles = findTargetFiles(nodeModulesDir);
console.log(`Found ${targetFiles.length} reconciler files to inspect.`);

for (const targetFile of targetFiles) {
  let content = fs.readFileSync(targetFile, 'utf8');
  let modified = false;

  // 1. Ensure aa.__SECRET_INTERNALS has fallbacks and ReactCurrentBatchConfig
  const secretPatternProd = /var\s+ea\s*=\s*aa\.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;/g;
  if (secretPatternProd.test(content)) {
    content = content.replace(
      secretPatternProd,
      'var ea=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED||aa.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE||{};if(!ea.ReactCurrentDispatcher){ea.ReactCurrentDispatcher={get current(){return ea.H},set current(v){ea.H=v}}};if(!ea.ReactCurrentBatchConfig)ea.ReactCurrentBatchConfig={transition:null};if(!ea.ReactCurrentOwner)ea.ReactCurrentOwner={current:null};if(!ea.ReactCurrentActQueue)ea.ReactCurrentActQueue={current:null};'
    );
    modified = true;
  }

  const secretPatternDev = /var\s+ReactSharedInternals\s*=\s*React\.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;/g;
  if (secretPatternDev.test(content)) {
    content = content.replace(
      secretPatternDev,
      'var ReactSharedInternals=React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED||React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE||{};if(!ReactSharedInternals.ReactCurrentDispatcher){ReactSharedInternals.ReactCurrentDispatcher={get current(){return ReactSharedInternals.H},set current(v){ReactSharedInternals.H=v}}};if(!ReactSharedInternals.ReactCurrentBatchConfig)ReactSharedInternals.ReactCurrentBatchConfig={transition:null};if(!ReactSharedInternals.ReactCurrentOwner)ReactSharedInternals.ReactCurrentOwner={current:null};if(!ReactSharedInternals.ReactCurrentActQueue)ReactSharedInternals.ReactCurrentActQueue={current:null};'
    );
    modified = true;
  }

  const secretPatternProfiling = /var\s+da\s*=\s*aa\.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;/g;
  if (secretPatternProfiling.test(content)) {
    content = content.replace(
      secretPatternProfiling,
      'var da=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED||aa.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE||{};if(!da.ReactCurrentDispatcher){da.ReactCurrentDispatcher={get current(){return da.H},set current(v){da.H=v}}};if(!da.ReactCurrentBatchConfig)da.ReactCurrentBatchConfig={transition:null};if(!da.ReactCurrentOwner)da.ReactCurrentOwner={current:null};if(!da.ReactCurrentActQueue)da.ReactCurrentActQueue={current:null};'
    );
    modified = true;
  }

  // 2. Ensure da_elem is defined
  if (targetFile.includes('production.min.js')) {
    if (!content.includes('da_elem=')) {
      if (content.includes('var fa=')) {
        content = content.replace('var fa=', 'var da_elem=Symbol.for("react.element"),fa=');
        modified = true;
      } else {
        const symbolDecl = 'var da_elem=Symbol.for("react.element"),fa=Symbol.for("react.transitional.element"),ha=Symbol.for("react.portal"),ia=Symbol.for("react.fragment"),ja=Symbol.for("react.strict_mode"),ka=Symbol.for("react.profiler"),la=Symbol.for("react.provider"),ma=Symbol.for("react.context"),na=Symbol.for("react.forward_ref"),oa=Symbol.for("react.suspense"),pa=Symbol.for("react.suspense_list"),qa=Symbol.for("react.memo"),ra=Symbol.for("react.lazy");';
        const anchor = 'Symbol.for("react.scope");';
        if (content.includes(anchor)) {
          content = content.replace(anchor, symbolDecl + anchor);
          modified = true;
        }
      }
    }

    // 3. Make case fa also match da_elem
    if (content.includes('case fa:') && !content.includes('case fa:case da_elem:')) {
      content = content.replaceAll('case fa:', 'case fa:case da_elem:');
      modified = true;
    }

    // 4. React 19 Context support
    const oldContextCase = 'case la:g=10;break a;case ma:g=9;break a;';
    const newContextCase = 'case la:case ma:g=10;break a;case Symbol.for("react.consumer"):g=9;break a;';
    if (content.includes(oldContextCase)) {
      content = content.replace(oldContextCase, newContextCase);
      modified = true;
    }

    // 5. Safe fallback for providerType._context in React 19
    if (content.includes('b.type._context')) {
      content = content.replaceAll('b.type._context', '(b.type._context||b.type)');
      modified = true;
    }
    if (content.includes('d.type._context')) {
      content = content.replaceAll('d.type._context', '(d.type._context||d.type)');
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`Patched: ${path.relative(nodeModulesDir, targetFile)}`);
  }
}

console.log('Reconciler patching complete.');
