const fs = require('fs');

function injectCSS(file) {
  let content = fs.readFileSync(file, 'utf8');
  const cssToInject = `
/* Hide timers and sticky buy bar when hardcopy is selected */
body.is-hardcopy-selected #arch-sticky-buy-bar,
body.is-hardcopy-selected .arch-sticky-timer,
body.is-hardcopy-selected .arch-pill-label,
body.is-hardcopy-selected .arch-pill-clock-wrap {
  display: none !important;
}
`;
  if (content.includes('Hide timers and sticky buy bar')) {
      console.log('Already injected in ' + file);
      return;
  }
  content = content.replace('</style>\n\n<script>', cssToInject + '</style>\n\n<script>');
  content = content.replace('</style>\r\n\r\n<script>', cssToInject + '</style>\r\n\r\n<script>');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Injected in ' + file);
}

injectCSS('index.html');
injectCSS('products/6-books-for-interior-exterior-design.html');
