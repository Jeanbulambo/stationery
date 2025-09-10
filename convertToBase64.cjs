const fs = require('fs');
const path = require('path');

const images = [
  { name: 'logo', file: './src/assets/logoktw.jpeg' },
  { name: 'signature', file: './src/assets/signature.png' },
];

images.forEach(({ name, file }) => {
  const imagePath = path.resolve(file);
  const ext = path.extname(file).slice(1); // jpeg ou png
  const imageData = fs.readFileSync(imagePath);
  const base64 = `data:image/${ext};base64,${imageData.toString('base64')}`;
  console.log(`${name}Base64 = '${base64}';\n`);
});
