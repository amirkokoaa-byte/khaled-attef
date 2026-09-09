const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(
  'await setDoc(doc(db, collectionName, id), data);',
  'const cleanData = JSON.parse(JSON.stringify(data));\n    await setDoc(doc(db, collectionName, id), cleanData);'
);

fs.writeFileSync('src/lib/firebase.ts', code);
