import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = path.join('src', 'assets', 'logoktw.jpeg'); // chemin vers ton logo
const outputDir = path.join('public');

const sizes = [192, 512];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

sizes.forEach(size => {
  const outputPath = path.join(outputDir, `manifest-icon-${size}.maskable.png`);
  sharp(inputPath)
    .resize(size, size)
    .png()
    .toFile(outputPath)
    .then(() => console.log(`✅ Icône générée : ${outputPath}`))
    .catch(err => console.error(err));
});
