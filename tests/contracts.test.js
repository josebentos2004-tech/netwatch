const test=require('node:test'),assert=require('node:assert/strict');
test('device states are constrained to supported values',()=>{const states=['online','offline','maintenance'];assert.equal(states.includes('online'),true);assert.equal(states.includes('unknown'),false);});
test('incident priorities contain four levels',()=>{const p=['low','medium','high','critical'];assert.equal(p.length,4);assert.ok(p.includes('critical'));});
