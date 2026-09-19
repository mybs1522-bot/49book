const fs = require('fs'); const html = fs.readFileSync('index.html', 'utf8'); console.log(html.indexOf('product-editorial-headline'));
