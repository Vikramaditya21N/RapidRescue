const fs = require('fs');
const path = require('path');
const dir = 'frontend';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
    const p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    
    // Remove Hospital Partnerships link
    c = c.replace(/<li><a href="#">Hospital Partnerships<\/a><\/li>/g, '');
    
    // Remove Privacy/Terms block in footers
    c = c.replace(/<span>[\s\S]*?<a href="#">Privacy Policy<\/a>[\s\S]*?<\/span>/g, '');
    
    // Remove social icons (fake links)
    c = c.replace(/<div class="footer-socials">[\s\S]*?<\/div>/g, '');
    
    fs.writeFileSync(p, c);
});

console.log('Cleaned HTML files');
