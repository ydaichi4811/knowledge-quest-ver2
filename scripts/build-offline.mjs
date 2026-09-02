import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const indexPath = resolve(dist, 'index.html');
let html = await readFile(indexPath, 'utf8');

const scriptMatch = html.match(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
if (!scriptMatch) throw new Error('Vite module script was not found in dist/index.html');
const scriptPath = resolve(dist, scriptMatch[1].replace(/^\.\//, '').replace(/^\//, ''));
const scriptCode = await readFile(scriptPath, 'utf8');
// Preserve module semantics while avoiding file:// module loading restrictions.
// Decode bytes into a Blob, then dynamically import its object URL.
const scriptBase64 = Buffer.from(scriptCode, 'utf8').toString('base64');
const bootstrap = `(()=>{const b=atob('${scriptBase64}');const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);const url=URL.createObjectURL(new Blob([u],{type:'text/javascript'}));import(url).catch(e=>{console.error(e);document.body.innerHTML='<main style="color:white;padding:24px;font-family:sans-serif"><h1>起動エラー</h1><p>オフライン版を起動できませんでした。</p><pre style="white-space:pre-wrap">'+String(e)+'</pre></main>'})})()`;
html = html.replace(scriptMatch[0], `<script>${bootstrap}</script>`);

const styleMatches = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)];
for (const match of styleMatches) {
  const stylePath = resolve(dist, match[1].replace(/^\.\//, '').replace(/^\//, ''));
  const css = await readFile(stylePath, 'utf8');
  html = html.replace(match[0], `<style>\n${css}\n</style>`);
}

html = html.replace('</head>', '<meta name="application-name" content="Knowledge Quest Offline"></head>');
const closingScriptTags = html.match(/<\/script>/gi) || [];
if (closingScriptTags.length !== 1) {
  throw new Error(`Offline HTML must contain exactly one closing script tag; found ${closingScriptTags.length}`);
}
await writeFile(indexPath, html, 'utf8');
await writeFile(resolve(dist, 'オフライン版の使い方.txt'), [
  'Knowledge Quest Ver.2 オフライン版',
  '',
  '1. ZIPを展開します。',
  '2. index.htmlをダブルクリックして開きます。',
  '3. 学習記録は、その端末のブラウザ内に保存されます。',
  '4. 別の端末とはデータ共有されません。',
  '5. フォルダ内のassetsは削除しないでください。',
].join('\r\n'), 'utf8');
console.log('Offline package prepared:', indexPath);
