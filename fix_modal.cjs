const fs = require('fs');
let code = fs.readFileSync('src/components/ManageBannersModal.tsx', 'utf8');

code = code.replace(
  'return (\n    <div className="fixed inset-0 z-[200]',
  'return (\n    <>\n    <div className="fixed inset-0 z-[200]'
);

code = code.replace(
  '  );\n}',
  '    </>\n  );\n}'
);

fs.writeFileSync('src/components/ManageBannersModal.tsx', code);
