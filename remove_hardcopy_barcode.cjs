const fs = require('fs');
let code = fs.readFileSync('src/components/HardcopyCheckoutPage.tsx', 'utf8');

const barcodeRegex = /\{\/\*\s*Authentic Vector Barcode\s*\*\/\}\s*<div[^>]*>\s*<svg[^>]*viewBox="0 0 1[78]6? 28"[\s\S]*?<\/svg>\s*<\/div>/g;
code = code.replace(barcodeRegex, '');

fs.writeFileSync('src/components/HardcopyCheckoutPage.tsx', code, 'utf8');
console.log('Processed HardcopyCheckoutPage.tsx');
