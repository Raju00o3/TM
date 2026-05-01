import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'M');
const destDir = path.join(__dirname, 'public', 'media');

const dirs = ['childhood', 'traditional', 'western', 'formal', 'casual', 'together'];
dirs.forEach(dir => {
  const p = path.join(destDir, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const mapping = {
  // ── Childhood (4 photos) ──
  'IMG_6744.JPG': 'childhood/childhood_01.jpg',
  'IMG_6745.JPG': 'childhood/childhood_02.jpg',
  'IMG_6776.JPG': 'childhood/childhood_03.jpg',
  'IMG_6779.JPG': 'childhood/childhood_04.jpg',

  // ── Traditional (6 photos) ──
  '881e8984-70cd-461e-bb72-807815b20aef.JPG': 'traditional/traditional_01.jpg',  // saree
  'IMG_6765.JPG': 'traditional/traditional_02.jpg',
  'IMG_6767.JPG': 'traditional/traditional_03.jpg',
  '16f7bc26-0990-47e3-99c0-b58e5a3884cb.JPG': 'traditional/traditional_04.jpg',  // semi-traditional rooftop
  '40a7d830-0cda-4b8e-abda-0b7a2ef4e2c6.JPG': 'traditional/traditional_05.jpg',  // kurta, haveli
  'IMG_6752.JPG': 'traditional/traditional_06.jpg',

  // ── Western (3 photos) ──
  'IMG_6770.JPG': 'western/western_01.jpg',
  '2CCA1397-F3CF-4570-B422-D651AFE8A429.JPG': 'western/western_02.jpg',  // red vest
  '0f7a52cb-31fe-4080-9050-6016dbc4f137.JPG': 'western/western_03.jpg',  // black top, city night

  // ── Formal (1 photo) ──
  '1777424561719_CAP_B86ED0D5-404D-4B13-B931-05DC4C72E12C.JPG': 'formal/formal_01.jpg',  // pink shirt mirror

  // ── Casual (2 photos, 1 png, 2 videos) ──
  'IMG_6791.JPG': 'casual/casual_01.jpg',
  'IMG_6662.PNG': 'casual/casual_02.png',
  '128E4BB1-0464-4FE4-AFF1-A33123D8DDEB.MOV': 'casual/casual_video_01.mov',
  '53123830-FC14-4128-A70B-8DDAA31B10F2.MOV': 'casual/casual_video_02.mov',

  // ── Together (7 photos, 1 video) ──
  '95dbcd07-4bbb-4921-b50d-e16ba089a70d.JPG': 'together/together_01.jpg',
  '9C3EB1D7-0D54-4F99-B045-C3473B1036FE.JPG': 'together/together_02.jpg',
  'ae157352-e0da-435c-a79b-00e8e6beb736.JPG': 'together/together_03.jpg',
  'IMG_4983.JPG': 'together/together_04.jpg',
  'IMG_6659.JPG': 'together/together_05.jpg',
  'IMG_5417.jpg': 'together/together_06.jpg',   // couple selfie (converted from HEIC)
  'IMG_5532.jpg': 'together/together_07.jpg',   // couple on rooftop (converted from HEIC)
  'e6157555-5023-4e98-8e81-c0f3c65cdf11.MP4': 'together/together_video_01.mp4',
};

console.log('Starting to copy files...');
let copied = 0;
let failed = 0;
for (const [srcName, destPath] of Object.entries(mapping)) {
  const src = path.join(srcDir, srcName);
  const dest = path.join(destDir, destPath);

  if (fs.existsSync(src)) {
    try {
      fs.copyFileSync(src, dest);
      console.log(`✓ ${srcName} → ${destPath}`);
      copied++;
    } catch (e) {
      console.error(`✗ Failed: ${srcName}: ${e.message}`);
      failed++;
    }
  } else {
    console.error(`✗ Not found: ${srcName}`);
    failed++;
  }
}

console.log('---');
console.log(`Done! Copied ${copied} files, ${failed} failures.`);
