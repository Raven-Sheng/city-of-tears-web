import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(await fs.readFile('film-parts/manifest.json', 'utf8'));
await fs.mkdir('site/media/film', {recursive:true});
const output = await fs.open('site/' + manifest.file, 'w');
const hash = createHash('sha256'); let size = 0;
try {
  for (const name of manifest.parts) {
    const part = await fs.readFile('film-parts/' + name);
    await output.writeFile(part); hash.update(part); size += part.length;
  }
} finally { await output.close(); }
if (size !== manifest.size || hash.digest('hex') !== manifest.sha256) throw new Error('Film integrity check failed');
console.log('Verified original web film: ' + size + ' bytes');
