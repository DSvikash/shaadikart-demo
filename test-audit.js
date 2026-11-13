// Partner-number audit: only the ShaadiKart call number may appear as a 10-digit phone in the app.
const fs = require('fs');
const app = fs.readFileSync(__dirname + '/js/app.js', 'utf8');
const data = fs.readFileSync(__dirname + '/js/data.js', 'utf8');
const ALLOWED = new Set(['5432112345']); // CALL_NO; customer placeholders are not 10-digit literals
let fail = 0;
const bad = m => { console.log('FAIL', m); fail++; };

// 1. app.js: every 10-digit literal must be allowed
for (const [i, line] of app.split('\n').entries())
  for (const n of line.match(/\b\d{10}\b/g) || []) if (!ALLOWED.has(n)) bad(`app.js:${i + 1} unexpected 10-digit number ${n}`);

// 2. data.js: 10-digit numbers allowed only as image-URL ids (unsplash photo-<id>); anything else is a phone leak
for (const [i, line] of data.split('\n').entries())
  for (const mm of line.matchAll(/\b\d{10}\b/g)) {
    const ctx = line.slice(Math.max(0, mm.index - 12), mm.index + 10);
    if (!/photo-|unsplash|\.jpg|img\//i.test(line)) bad(`data.js:${i + 1} 10-digit number outside an image reference: ${mm[0]}`);
    else if (/phone|tel|mobile|call|whatsapp/i.test(ctx)) bad(`data.js:${i + 1} phone-like context ${ctx}`);
  }

// 3. Partner records must carry no phone/mobile/contact/whatsapp fields
if (/\b(phone|mobile|whatsapp|contactNo)\s*:/i.test(data)) bad('data.js defines a phone/mobile/whatsapp field');

// 4. No tel:/wa.me links to anything but CALL_NO; no +91 literals with other numbers
for (const m of app.matchAll(/(tel:|wa\.me\/|\+91[\s-]?)(\d[\d\s-]*)/g)) {
  const d = m[2].replace(/\D/g, '');
  if (d && !/^0+$/.test(d) && !d.endsWith('5432112345') && d.length >= 6) bad(`app.js link/number ${m[0]}`);
}
console.log(fail ? `${fail} failure(s)` : 'PASS partner-number audit');
process.exit(fail ? 1 : 0);
