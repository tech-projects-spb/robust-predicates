
const fs = require('fs');
const {test} = require('tape');
const robustOrientation = require('robust-orientation');
const nextafter = require('nextafter');

const {
    orient2d, orient2dfast,
    orient3d, orient3dfast,
    incircle, incirclefast,
    insphere, inspherefast
} = require('../index.js');

test('orient2d', (t) => {
    t.ok(orient2d(0, 0, 1, 1, 0, 1) < 0, 'clockwise');
    t.ok(orient2d(0, 0, 0, 1, 1, 1) > 0, 'counterclockwise');
    t.ok(orient2d(0, 0, 0.5, 0.5, 1, 1) === 0, 'collinear');

    const r = 0.95;
    const q = 18;
    const p = 16.8;
    const w = Math.pow(2, -43);

    for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 128; j++) {
            const x = r + w * i / 128;
            const y = r + w * j / 128;

            const o = orient2d(x, y, q, q, p, p);
            const o2 = robustOrientation[3]([x, y], [q, q], [p, p]);

            if (Math.sign(o) !== Math.sign(o2)) {
                t.fail(`${x},${y}, ${q},${q}, ${p},${p}: ${o} vs ${o2}`);
            }
        }
    }
    t.pass('512x512 near-collinear');

    const lines = fs.readFileSync('test/fixtures/orient2d.txt', {encoding: 'utf8', flag: 'r'}).trim().split(/\r?\n/);
    for (const line of lines) {
        const [, ax, ay, bx, by, cx, cy, sign] = line.split(' ').map(Number);
        const result = orient2d(ax, ay, bx, by, cx, cy);
        if (Math.sign(result) !== -sign) {
            t.fail(`${line}: ${result} vs ${-sign}`);
        }
    }
    t.pass('1000 hard fixtures');

    t.end();
});

test('orient2dfast', (t) => {
    t.ok(orient2dfast(0, 0, 1, 1, 0, 1) < 0, 'counterclockwise');
    t.ok(orient2dfast(0, 0, 0, 1, 1, 1) > 0, 'clockwise');
    t.ok(orient2dfast(0, 0, 0.5, 0.5, 1, 1) === 0, 'collinear');
    t.end();
});

test('incircle', (t) => {
    t.ok(incircle(0, -1, 0, 1, 1, 0, -0.5, 0) < 0, 'inside');
    t.ok(incircle(0, -1, 1, 0, 0, 1, -1, 0) === 0, 'on circle');
    t.ok(incircle(0, -1, 0, 1, 1, 0, -1.5, 0) > 0, 'outside');

    const a = nextafter(-1, 0);
    const b = nextafter(-1, -2);

    t.ok(incircle(1, 0, -1, 0, 0, 1, 0, a) < 0, 'near inside');
    t.ok(incircle(1, 0, -1, 0, 0, 1, 0, b) > 0, 'near outside');

    let x = 1e-64;
    for (let i = 0; i < 128; i++) {
        if (incircle(0, x, -x, -x, x, -x, 0, 0) <= 0) t.fail(`incircle test ${x}, outside`);
        if (incircle(0, x, -x, -x, x, -x, 0, 2 * x) >= 0) t.fail(`incircle test ${x}, inside`);
        if (incircle(0, x, -x, -x, x, -x, 0, x) !== 0) t.fail(`incircle test ${x}, cocircular`);
        x *= 10;
    }
    t.pass(`${128 * 3} incircle tests`);

    const lines = fs.readFileSync('test/fixtures/incircle.txt', {encoding: 'utf8', flag: 'r'}).trim().split(/\r?\n/);
    for (const line of lines) {
        const [, ax, ay, bx, by, cx, cy, dx, dy, sign] = line.split(' ').map(Number);
        const result = incircle(ax, ay, bx, by, cx, cy, dx, dy);
        if (Math.sign(result) !== sign) {
            t.fail(`${line}: ${result} vs ${sign}`);
        }
    }
    t.pass('1000 hard fixtures');

    t.end();
});

test('incirclefast', (t) => {
    t.ok(incirclefast(0, -1, 0, 1, 1, 0, -0.5, 0) < 0, 'inside');
    t.ok(incirclefast(0, -1, 0, 1, 1, 0, -1, 0) === 0, 'on circle');
    t.ok(incirclefast(0, -1, 0, 1, 1, 0, -1.5, 0) > 0, 'outside');
    t.end();
});

test('orient3d', (t) => {
    t.ok(orient3d(
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        0, 0, 1
    ) > 0, 'above');

    t.ok(orient3d(
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        0, 0, -1
    ) < 0, 'below');

    t.ok(orient3d(
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        0, 0, 0
    ) === 0, 'coplanar');

    const a = nextafter(0, 1);
    const b = nextafter(0, -1);

    t.ok(orient3d(
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        0, 0, a
    ) > 0, 'near above');

    t.ok(orient3d(
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        0, 0, b
    ) < 0, 'near below');

    const lines = fs.readFileSync('test/fixtures/orient3d.txt', {encoding: 'utf8', flag: 'r'}).trim().split(/\r?\n/);
    for (const line of lines) {
        const [, ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, sign] = line.split(' ').map(Number);
        const result = orient3d(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz);
        if (Math.sign(result) !== sign) t.fail(`${line}: ${result} vs ${sign}`);
        if (Math.sign(result) !== Math.sign(orient3d(dx, dy, dz, bx, by, bz, ax, ay, az, cx, cy, cz))) t.fail('symmetry');
    }
    t.pass('1000 hard fixtures');

    const tol = 5.0e-14;

    for (let i = 0; i < 1000; i++) {
        const ax = 0.5 + tol * Math.random();
        const ay = 0.5 + tol * Math.random();
        const az = 0.5 + tol * Math.random();
        const b = 12, c = 24, d = 48;
        if (orient3d(b, b, b, c, c, c, d, d, d, ax, ay, az) !== 0) t.fail('degenerate');
        if (orient3d(c, c, c, d, d, d, ax, ay, az, b, b, b) !== 0) t.fail('degenerate');
    }
    t.pass('1000 degenerate cases');

    t.end();
});

test('orient3dfast', (t) => {
    t.ok(orient3dfast(
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        0, 0, 1
    ) > 0, 'above');

    t.ok(orient3dfast(
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        0, 0, -1
    ) < 0, 'below');

    t.ok(orient3dfast(
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        0, 0, 0
    ) === 0, 'coplanar');

    t.end();
});

test('insphere', (t) => {
    t.ok(insphere(
        1, 0, 0,
        0, -1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, 0
    ) < 0, 'inside');

    t.ok(insphere(
        1, 0, 0,
        0, -1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, 2
    ) > 0, 'outside');

    t.ok(insphere(
        1, 0, 0,
        0, -1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, -1
    ) === 0, 'cospherical');

    const a = nextafter(-1, 0);
    const b = nextafter(-1, -2);

    t.ok(insphere(
        1, 0, 0,
        0, -1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, a
    ) < 0, 'near inside');

    t.ok(insphere(
        1, 0, 0,
        0, -1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, b
    ) > 0, 'near outside');

    const lines = fs.readFileSync('test/fixtures/insphere.txt', {encoding: 'utf8', flag: 'r'}).trim().split(/\r?\n/);
    for (const line of lines) {
        const [, ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez, sign] = line.split(' ').map(Number);
        const result = insphere(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez);
        if (Math.sign(result) !== -sign) {
            t.fail(`${line}: ${result} vs ${-sign}`);
        }
    }
    t.pass('1000 hard fixtures');

    t.end();
});

test('inspherefast', (t) => {
    t.ok(inspherefast(
        1, 0, 0,
        0, -1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, 0
    ) < 0, 'inside');

    t.ok(inspherefast(
        1, 0, 0,
        0, -1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, 2
    ) > 0, 'outside');

    t.ok(inspherefast(
        1, 0, 0,
        0, -1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, -1
    ) === 0, 'cospherical');

    t.end();
});
