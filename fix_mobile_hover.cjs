const fs = require('fs');

// Fix AdminAuth.tsx timeline thumbnails
let adminAuth = fs.readFileSync('src/components/AdminAuth.tsx', 'utf8');
adminAuth = adminAuth.replace(
  'className="absolute inset-0 bg-red-500/80 hidden group-hover:flex items-center justify-center text-white backdrop-blur-sm transition-all"',
  'className="absolute inset-0 bg-red-500/80 flex opacity-100 md:opacity-0 md:group-hover:opacity-100 items-center justify-center text-white backdrop-blur-sm transition-all"'
);
fs.writeFileSync('src/components/AdminAuth.tsx', adminAuth);

// Fix PortfolioSection.tsx media card controls
let portfolio = fs.readFileSync('src/components/PortfolioSection.tsx', 'utf8');
portfolio = portfolio.replace(
  'className="absolute top-2 left-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"',
  'className="absolute top-2 left-2 flex gap-1 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"'
);
fs.writeFileSync('src/components/PortfolioSection.tsx', portfolio);

