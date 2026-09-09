const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(
  "export const db = app ? getFirestore(app) : null;",
  "import { initializeFirestore } from 'firebase/firestore';\nexport const db = app ? initializeFirestore(app, { experimentalForceLongPolling: true }) : null;"
);

fs.writeFileSync('src/lib/firebase.ts', code);
