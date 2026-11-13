// Verifies the demo clock in js/app.js. The IIFE can't be required, so the CLOCK/now() lines are extracted from source and evaluated.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/js/app.js', 'utf8');
const m = src.match(/const CLOCK = [^\n]*\n\s*const now = [^\n]*/);
if (!m) { console.log('FAIL extract CLOCK/now() from js/app.js'); process.exit(1); }
const window = {};
const { CLOCK, now } = new Function('window', m[0] + '; return { CLOCK, now };')(window);
let fail = 0;
const check = (name, ok) => { console.log((ok ? 'PASS ' : 'FAIL ') + name); if (!ok) fail++; };
const near = (a, b) => Math.abs(a - b) < 50;
check('CLOCK default is { offset: 0, speed: 1 }', CLOCK.offset === 0 && CLOCK.speed === 1);
check('CLOCK exposed on window', window.CLOCK === CLOCK);
check('offset 0 -> now() ~ Date.now()', near(now(), Date.now()));
CLOCK.offset = 5000;
check('offset 5000 -> now() ~ Date.now() + 5000', near(now(), Date.now() + 5000));
CLOCK.offset = -3600e3;
check('negative offset shifts back', near(now(), Date.now() - 3600e3));
CLOCK.offset = 0; CLOCK.speed = 10;
check('speed field does not alter now() (offset-only model; dock must write offset)', near(now(), Date.now()));
process.exit(fail ? 1 : 0);
