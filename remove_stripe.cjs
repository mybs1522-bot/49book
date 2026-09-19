const fs = require('fs');

function processFile(filename) {
    if (!fs.existsSync(filename)) return;
    let code = fs.readFileSync(filename, 'utf8');

    // Remove Powered by Stripe footer
    const footerRegex = /\{\/\*\s*Footer\s*\*\/\}\s*<div[^>]*>\s*<span>Powered by<\/span>\s*<img[^>]*Stripe_Logo[^>]*>\s*<\/div>/g;
    code = code.replace(footerRegex, '');

    const footerRegex2 = /<div[^>]*>\s*<span>Powered by<\/span>\s*<img[^>]*Stripe_Logo[^>]*>\s*<\/div>/g;
    code = code.replace(footerRegex2, '');
    
    const footerRegex3 = /<div[^>]*>\s*<span[^>]*>Powered by<\/span>\s*<img[^>]*>\s*<\/div>/g;
    code = code.replace(footerRegex3, '');

    // Remove barcode block
    const barcodeRegex = /\{\/\*\s*Barcode Accent\s*\*\/\}\s*<div[^>]*>\s*<svg[^>]*viewBox="0 0 1[78]0? 28"[\s\S]*?<\/svg>\s*<\/div>/g;
    code = code.replace(barcodeRegex, '');

    // Another barcode regex without the comment just in case
    const barcodeRegex2 = /<div[^>]*>\s*<svg[^>]*viewBox="0 0 1[78]0? 28"[\s\S]*?<\/svg>\s*<\/div>/g;
    code = code.replace(barcodeRegex2, '');

    // specifically 176 or 180
    const barcodeRegex3 = /\{\/\*\s*Barcode Accent\s*\*\/\}\s*<div[^>]*>\s*<svg[^>]*viewBox="0 0 1[78]6? 28"[\s\S]*?<\/svg>\s*<\/div>/g;
    code = code.replace(barcodeRegex3, '');

    fs.writeFileSync(filename, code, 'utf8');
    console.log('Processed', filename);
}

processFile('src/components/CheckoutPage.tsx');
processFile('src/components/HardcopyCheckoutPage.tsx');
processFile('src/components/courses/CourseCheckoutPage.tsx');
