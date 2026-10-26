const fs = require('fs');
const path = require('path');

function findReconcilerFiles(dir) {
  let files = [];
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === '.git') continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files = files.concat(findReconcilerFiles(fullPath));
      } else if (item === 'react-reconciler.production.min.js') {
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

const targetFiles = findReconcilerFiles(nodeModulesDir);
if (targetFiles.length === 0) {
  console.log('No react-reconciler.production.min.js found to patch.');
  process.exit(0);
}

for (const targetFile of targetFiles) {
  let content = fs.readFileSync(targetFile, 'utf8');

  // 1. Ensure da_elem is defined
  if (!content.includes('da_elem=')) {
    if (content.includes('var fa=')) {
      content = content.replace('var fa=', 'var da_elem=Symbol.for("react.element"),fa=');
    } else {
      const symbolDecl = 'var da_elem=Symbol.for("react.element"),fa=Symbol.for("react.transitional.element"),ha=Symbol.for("react.portal"),ia=Symbol.for("react.fragment"),ja=Symbol.for("react.strict_mode"),ka=Symbol.for("react.profiler"),la=Symbol.for("react.provider"),ma=Symbol.for("react.context"),na=Symbol.for("react.forward_ref"),oa=Symbol.for("react.suspense"),pa=Symbol.for("react.suspense_list"),qa=Symbol.for("react.memo"),ra=Symbol.for("react.lazy");';
      const anchor = 'Symbol.for("react.scope");';
      content = content.replace(anchor, symbolDecl + anchor);
    }
  }

  // 2. Make case fa also match da_elem (both react.transitional.element and react.element)
  if (content.includes('case fa:') && !content.includes('case fa:case da_elem:')) {
    content = content.replaceAll('case fa:', 'case fa:case da_elem:');
  }

  // 3. React 19 Context support: React 19 treats `react.context` as a Provider, not a Consumer!
  const oldContextCase = 'case la:g=10;break a;case ma:g=9;break a;';
  const newContextCase = 'case la:case ma:g=10;break a;case Symbol.for("react.consumer"):g=9;break a;';
  if (content.includes(oldContextCase)) {
    content = content.replace(oldContextCase, newContextCase);
  }

  // 4. Safe fallback for providerType._context in React 19
  content = content.replaceAll('b.type._context', '(b.type._context||b.type)');
  content = content.replaceAll('d.type._context', '(d.type._context||d.type)');

  fs.writeFileSync(targetFile, content, 'utf8');
}

console.log('Reconciler patching complete.');
