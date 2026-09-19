const fs = require('fs'); const html = fs.readFileSync('index.html', 'utf8'); const m = html.match(/Small design mistakes/); if(m) console.log(html.substring(m.index - 50, m.index + 2000));
