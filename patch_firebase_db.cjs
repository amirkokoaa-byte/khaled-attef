const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

code = code.replace(
  /const firebaseConfig = \{[\s\S]*?\};/,
  "const firebaseConfig = {\n" +
  "  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '" + config.apiKey + "',\n" +
  "  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '" + config.authDomain + "',\n" +
  "  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '" + config.projectId + "',\n" +
  "  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '" + config.storageBucket + "',\n" +
  "  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '" + config.messagingSenderId + "',\n" +
  "  appId: import.meta.env.VITE_FIREBASE_APP_ID || '" + config.appId + "'\n" +
  "};"
);

code = code.replace(
  'export const db = app ? initializeFirestore(app, { experimentalForceLongPolling: true }) : null;',
  "export const db = app ? initializeFirestore(app, { experimentalForceLongPolling: true }, '" + config.firestoreDatabaseId + "') : null;"
);

fs.writeFileSync('src/lib/firebase.ts', code);
