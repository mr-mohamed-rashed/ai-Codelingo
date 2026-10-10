const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');

async function run() {
  console.log('Starting asset optimization via buffers...');

  // 1. app-logo
  const appLogoPath = path.join(publicDir, 'app-logo.jpg');
  if (fs.existsSync(appLogoPath)) {
    const inputBuf = fs.readFileSync(appLogoPath);
    const webpBuf = await sharp(inputBuf)
      .resize(360, 360, { fit: 'cover' })
      .webp({ quality: 82, effort: 6 })
      .toBuffer();
    fs.writeFileSync(path.join(publicDir, 'app-logo.webp'), webpBuf);

    const jpegBuf = await sharp(inputBuf)
      .resize(360, 360, { fit: 'cover' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(appLogoPath, jpegBuf);
    console.log(`✓ app-logo.webp (${webpBuf.length} B) & app-logo.jpg (${jpegBuf.length} B)`);
  }

  // 2. icon-192
  const icon192Path = path.join(publicDir, 'icon-192.png');
  if (fs.existsSync(icon192Path)) {
    const inputBuf = fs.readFileSync(icon192Path);
    const webpBuf = await sharp(inputBuf)
      .resize(192, 192)
      .webp({ quality: 85, effort: 6 })
      .toBuffer();
    fs.writeFileSync(path.join(publicDir, 'icon-192.webp'), webpBuf);

    const pngBuf = await sharp(inputBuf)
      .resize(192, 192)
      .png({ compressionLevel: 9, effort: 10, palette: true })
      .toBuffer();
    fs.writeFileSync(icon192Path, pngBuf);
    console.log(`✓ icon-192.webp (${webpBuf.length} B) & icon-192.png (${pngBuf.length} B)`);
  }

  // 3. icon-512
  const icon512Path = path.join(publicDir, 'icon-512.png');
  if (fs.existsSync(icon512Path)) {
    const inputBuf = fs.readFileSync(icon512Path);
    const webpBuf = await sharp(inputBuf)
      .resize(512, 512)
      .webp({ quality: 85, effort: 6 })
      .toBuffer();
    fs.writeFileSync(path.join(publicDir, 'icon-512.webp'), webpBuf);

    const pngBuf = await sharp(inputBuf)
      .resize(512, 512)
      .png({ compressionLevel: 9, effort: 10, palette: true })
      .toBuffer();
    fs.writeFileSync(icon512Path, pngBuf);
    console.log(`✓ icon-512.webp (${webpBuf.length} B) & icon-512.png (${pngBuf.length} B)`);
  }

  // 4. icon-maskable
  const iconMaskablePath = path.join(publicDir, 'icon-maskable.png');
  if (fs.existsSync(iconMaskablePath)) {
    const inputBuf = fs.readFileSync(iconMaskablePath);
    const pngBuf = await sharp(inputBuf)
      .resize(512, 512)
      .png({ compressionLevel: 9, effort: 10, palette: true })
      .toBuffer();
    fs.writeFileSync(iconMaskablePath, pngBuf);
    console.log(`✓ icon-maskable.png (${pngBuf.length} B)`);
  }

  console.log('All image optimization finished successfully!');
}

run().catch(console.error);
