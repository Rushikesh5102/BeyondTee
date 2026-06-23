/* eslint-disable */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'logo_source.pdf');
const dest = path.join(__dirname, 'public', 'logo.png');

console.log(`Converting ${src} to ${dest}...`);

sharp(src, { density: 300 }) // High density for good quality
    .resize(500) // Resize to reasonable width
    .png()
    .toFile(dest)
    .then(info => {
        console.log('Conversion successful:', info);
    })
    .catch(err => {
        console.error('Conversion failed:', err);
        process.exit(1);
    });
