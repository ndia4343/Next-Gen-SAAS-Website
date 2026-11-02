const fs = require('fs');
const path = require('path');

function findTargetFiles(dir, visited = new Set()) {
  let files = [];
  try {
    let realDir;
    try {
      realDir = fs.realpathSync(dir);
      if (visited.has(realDir)) return files;
      visited.add(realDir);
    } catch {
      // ignore
    }

    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === '.git' || item === '.next') continue;
      const fullPath = path.join(dir, item);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        files = files.concat(findTargetFiles(fullPath, visited));
      } else if (
        (item.startsWith('react-reconciler') || item.includes('react-reconciler')) &&
        item.endsWith('.js')
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

const helper = 'var __patch_safe_internals=function(o){if(!o)o={};if(!o.ReactCurrentDispatcher){o.ReactCurrentDispatcher={get current(){return o.H||null;},set current(v){o.H=v;}};}if(!o.ReactCurrentBatchConfig)o.ReactCurrentBatchConfig={transition:null};if(!o.ReactCurrentOwner)o.ReactCurrentOwner={current:null};if(!o.ReactCurrentActQueue)o.ReactCurrentActQueue={current:null,isBatchingLegacy:false,didScheduleLegacyUpdate:false};return o;};';

for (const targetFile of targetFiles) {
  let content = fs.readFileSync(targetFile, 'utf8');
  let modified = false;

  // 1. Inject safe internals helper if not present
  if (!content.includes('__patch_safe_internals')) {
    content = helper + content;
    modified = true;
  }

  // 2. Universal regex for ANY variable name or comma/semicolon pattern
  // Matches: u.__SECRET_INTERNALS..., aa.__SECRET_INTERNALS..., React.__SECRET_INTERNALS...
  if (content.includes('__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED')) {
    const newContent = content.replace(
      /([a-zA-Z0-9_$]+)\.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED/g,
      '__patch_safe_internals($1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED||$1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE||(typeof globalThis!=="undefined"&&globalThis.__REACT_INTERNALS_POLYFILL)||{})'
    );
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }

  // 3. Bulletproof safe property access: prevent any "Cannot read properties of undefined (reading 'ReactCurrentBatchConfig')"
  if (content.includes('.ReactCurrentBatchConfig')) {
    const newContent = content.replace(
      /([a-zA-Z0-9_$]+)\.ReactCurrentBatchConfig\b(?!\s*=)/g,
      '($1&&$1.ReactCurrentBatchConfig||{transition:null})'
    );
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }

  if (content.includes('.ReactCurrentDispatcher')) {
    const newContent = content.replace(
      /([a-zA-Z0-9_$]+)\.ReactCurrentDispatcher\b(?!\s*=)/g,
      '($1&&$1.ReactCurrentDispatcher||{get current(){return $1?($1.H||null):null},set current(v){if($1)$1.H=v}})'
    );
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }

  if (content.includes('.ReactCurrentOwner')) {
    const newContent = content.replace(
      /([a-zA-Z0-9_$]+)\.ReactCurrentOwner\b(?!\s*=)/g,
      '($1&&$1.ReactCurrentOwner||{current:null})'
    );
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }

  if (content.includes('.ReactCurrentActQueue')) {
    const newContent = content.replace(
      /([a-zA-Z0-9_$]+)\.ReactCurrentActQueue\b(?!\s*=)/g,
      '($1&&$1.ReactCurrentActQueue||{current:null})'
    );
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  }

  // 4. Ensure da_elem is defined
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

    // 5. Make case fa also match da_elem
    if (content.includes('case fa:') && !content.includes('case fa:case da_elem:')) {
      content = content.replaceAll('case fa:', 'case fa:case da_elem:');
      modified = true;
    }

    // 6. React 19 Context support
    const oldContextCase = 'case la:g=10;break a;case ma:g=9;break a;';
    const newContextCase = 'case la:case ma:g=10;break a;case Symbol.for("react.consumer"):g=9;break a;';
    if (content.includes(oldContextCase)) {
      content = content.replace(oldContextCase, newContextCase);
      modified = true;
    }

    // 7. Safe fallback for providerType._context in React 19
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
