const {epsilon, splitter, resulterrbound, estimate, vec, sum, sum_three, scale, negate} = require('./util.js');

const isperrboundA = (16 + 224 * epsilon) * epsilon;
const isperrboundB = (5 + 72 * epsilon) * epsilon;
const isperrboundC = (71 + 1408 * epsilon) * epsilon * epsilon;

const ab = vec(4);
const bc = vec(4);
const cd = vec(4);
const de = vec(4);
const ea = vec(4);
const ac = vec(4);
const bd = vec(4);
const ce = vec(4);
const da = vec(4);
const eb = vec(4);

const abc = vec(24);
const bcd = vec(24);
const cde = vec(24);
const dea = vec(24);
const eab = vec(24);
const abd = vec(24);
const bce = vec(24);
const cda = vec(24);
const deb = vec(24);
const eac = vec(24);

const adet = vec(1152);
const bdet = vec(1152);
const cdet = vec(1152);
const ddet = vec(1152);
const edet = vec(1152);
const abdet = vec(2304);
const cddet = vec(2304);
const cdedet = vec(3456);
const deter = vec(5760);

const _8 = vec(8);
const _8b = vec(8);
const _8c = vec(8);
const _16 = vec(16);
const _24 = vec(24);
const _48 = vec(48);
const _48b = vec(48);
const _96 = vec(96);
const _192 = vec(192);
const _384x = vec(384);
const _384y = vec(384);
const _384z = vec(384);
const _768 = vec(768);

function sum_three_scale(a, b, c, az, bz, cz, out) {
    return sum_three(
        scale(4, a, az, _8), _8,
        scale(4, b, bz, _8b), _8b,
        scale(4, c, cz, _8c), _8c, _16, out);
}

function liftexact(alen, a, blen, b, clen, c, dlen, d, x, y, z, out) {
    const len = sum(
        sum(alen, a, blen, b, _48), _48,
        negate(sum(clen, c, dlen, d, _48b), _48b), _48b, _96);

    return sum_three(
        scale(scale(len, _96, x, _192), _192, x, _384x), _384x,
        scale(scale(len, _96, y, _192), _192, y, _384y), _384y,
        scale(scale(len, _96, z, _192), _192, z, _384z), _384z, _768, out);
}

function insphereexact(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez) {
    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;

    $Cross_Product(ax, ay, bx, by, ab);
    $Cross_Product(bx, by, cx, cy, bc);
    $Cross_Product(cx, cy, dx, dy, cd);
    $Cross_Product(dx, dy, ex, ey, de);
    $Cross_Product(ex, ey, ax, ay, ea);
    $Cross_Product(ax, ay, cx, cy, ac);
    $Cross_Product(bx, by, dx, dy, bd);
    $Cross_Product(cx, cy, ex, ey, ce);
    $Cross_Product(dx, dy, ax, ay, da);
    $Cross_Product(ex, ey, bx, by, eb);

    const abclen = sum_three_scale(ab, bc, ac, cz, az, -bz, abc);
    const bcdlen = sum_three_scale(bc, cd, bd, dz, bz, -cz, bcd);
    const cdelen = sum_three_scale(cd, de, ce, ez, cz, -dz, cde);
    const dealen = sum_three_scale(de, ea, da, az, dz, -ez, dea);
    const eablen = sum_three_scale(ea, ab, eb, bz, ez, -az, eab);
    const abdlen = sum_three_scale(ab, bd, da, dz, az, bz, abd);
    const bcelen = sum_three_scale(bc, ce, eb, ez, bz, cz, bce);
    const cdalen = sum_three_scale(cd, da, ac, az, cz, dz, cda);
    const deblen = sum_three_scale(de, eb, bd, bz, dz, ez, deb);
    const eaclen = sum_three_scale(ea, ac, ce, cz, ez, az, eac);

    const deterlen = sum_three(
        liftexact(cdelen, cde, bcelen, bce, deblen, deb, bcdlen, bcd, ax, ay, az, adet), adet,
        liftexact(dealen, dea, cdalen, cda, eaclen, eac, cdelen, cde, bx, by, bz, bdet), bdet,
        sum_three(
            liftexact(eablen, eab, deblen, deb, abdlen, abd, dealen, dea, cx, cy, cz, cdet), cdet,
            liftexact(abclen, abc, eaclen, eac, bcelen, bce, eablen, eab, dx, dy, dz, ddet), ddet,
            liftexact(bcdlen, bcd, abdlen, abd, cdalen, cda, abclen, abc, ex, ey, ez, edet), edet, cddet, cdedet), cdedet, abdet, deter);

    return deter[deterlen - 1];
}

const xdet = vec(96);
const ydet = vec(96);
const zdet = vec(96);
const fin = vec(1152);

function liftadapt(a, b, c, az, bz, cz, x, y, z, out) {
    const len = sum_three_scale(a, b, c, az, bz, cz, _24);
    return sum_three(
        scale(scale(len, _24, x, _48), _48, x, xdet), xdet,
        scale(scale(len, _24, y, _48), _48, y, ydet), ydet,
        scale(scale(len, _24, z, _48), _48, z, zdet), zdet, _192, out);
}

function insphereadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez, permanent) {
    let ab3, bc3, cd3, da3, ac3, bd3;

    let aextail, bextail, cextail, dextail;
    let aeytail, beytail, ceytail, deytail;
    let aeztail, beztail, ceztail, deztail;

    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0;

    const aex = ax - ex;
    const bex = bx - ex;
    const cex = cx - ex;
    const dex = dx - ex;
    const aey = ay - ey;
    const bey = by - ey;
    const cey = cy - ey;
    const dey = dy - ey;
    const aez = az - ez;
    const bez = bz - ez;
    const cez = cz - ez;
    const dez = dz - ez;

    $Cross_Product(aex, aey, bex, bey, ab, ab3);
    $Cross_Product(bex, bey, cex, cey, bc, bc3);
    $Cross_Product(cex, cey, dex, dey, cd, cd3);
    $Cross_Product(dex, dey, aex, aey, da, da3);
    $Cross_Product(aex, aey, cex, cey, ac, ac3);
    $Cross_Product(bex, bey, dex, dey, bd, bd3);

    const finlen = sum(
        sum(
            negate(liftadapt(bc, cd, bd, dez, bez, -cez, aex, aey, aez, adet), adet), adet,
            liftadapt(cd, da, ac, aez, cez, dez, bex, bey, bez, bdet), bdet, abdet), abdet,
        sum(
            negate(liftadapt(da, ab, bd, bez, dez, aez, cex, cey, cez, cdet), cdet), cdet,
            liftadapt(ab, bc, ac, cez, aez, -bez, dex, dey, dez, ddet), ddet, cddet), cddet, fin);

    let det = estimate(finlen, fin);
    let errbound = isperrboundB * permanent;
    if (det >= errbound || -det >= errbound) {
        return det;
    }

    $Two_Diff_Tail(ax, ex, aex, aextail);
    $Two_Diff_Tail(ay, ey, aey, aeytail);
    $Two_Diff_Tail(az, ez, aez, aeztail);
    $Two_Diff_Tail(bx, ex, bex, bextail);
    $Two_Diff_Tail(by, ey, bey, beytail);
    $Two_Diff_Tail(bz, ez, bez, beztail);
    $Two_Diff_Tail(cx, ex, cex, cextail);
    $Two_Diff_Tail(cy, ey, cey, ceytail);
    $Two_Diff_Tail(cz, ez, cez, ceztail);
    $Two_Diff_Tail(dx, ex, dex, dextail);
    $Two_Diff_Tail(dy, ey, dey, deytail);
    $Two_Diff_Tail(dz, ez, dez, deztail);
    if (aextail === 0 && aeytail === 0 && aeztail === 0 &&
        bextail === 0 && beytail === 0 && beztail === 0 &&
        cextail === 0 && ceytail === 0 && ceztail === 0 &&
        dextail === 0 && deytail === 0 && deztail === 0) {
        return det;
    }

    errbound = isperrboundC * permanent + resulterrbound * Math.abs(det);

    const abeps = (aex * beytail + bey * aextail) - (aey * bextail + bex * aeytail);
    const bceps = (bex * ceytail + cey * bextail) - (bey * cextail + cex * beytail);
    const cdeps = (cex * deytail + dey * cextail) - (cey * dextail + dex * ceytail);
    const daeps = (dex * aeytail + aey * dextail) - (dey * aextail + aex * deytail);
    const aceps = (aex * ceytail + cey * aextail) - (aey * cextail + cex * aeytail);
    const bdeps = (bex * deytail + dey * bextail) - (bey * dextail + dex * beytail);
    det +=
        (((bex * bex + bey * bey + bez * bez) * ((cez * daeps + dez * aceps + aez * cdeps) +
        (ceztail * da3 + deztail * ac3 + aeztail * cd3)) + (dex * dex + dey * dey + dez * dez) *
        ((aez * bceps - bez * aceps + cez * abeps) + (aeztail * bc3 - beztail * ac3 + ceztail * ab3))) -
        ((aex * aex + aey * aey + aez * aez) * ((bez * cdeps - cez * bdeps + dez * bceps) +
        (beztail * cd3 - ceztail * bd3 + deztail * bc3)) + (cex * cex + cey * cey + cez * cez) *
        ((dez * abeps + aez * bdeps + bez * daeps) + (deztail * ab3 + aeztail * bd3 + beztail * da3)))) +
        2 * (((bex * bextail + bey * beytail + bez * beztail) * (cez * da3 + dez * ac3 + aez * cd3) +
        (dex * dextail + dey * deytail + dez * deztail) * (aez * bc3 - bez * ac3 + cez * ab3)) -
        ((aex * aextail + aey * aeytail + aez * aeztail) * (bez * cd3 - cez * bd3 + dez * bc3) +
        (cex * cextail + cey * ceytail + cez * ceztail) * (dez * ab3 + aez * bd3 + bez * da3)));

    if (det >= errbound || -det >= errbound) {
        return det;
    }

    return insphereexact(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez);
}

function insphere(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez) {
    const aex = ax - ex;
    const bex = bx - ex;
    const cex = cx - ex;
    const dex = dx - ex;
    const aey = ay - ey;
    const bey = by - ey;
    const cey = cy - ey;
    const dey = dy - ey;
    const aez = az - ez;
    const bez = bz - ez;
    const cez = cz - ez;
    const dez = dz - ez;

    const aexbey = aex * bey;
    const bexaey = bex * aey;
    const ab = aexbey - bexaey;
    const bexcey = bex * cey;
    const cexbey = cex * bey;
    const bc = bexcey - cexbey;
    const cexdey = cex * dey;
    const dexcey = dex * cey;
    const cd = cexdey - dexcey;
    const dexaey = dex * aey;
    const aexdey = aex * dey;
    const da = dexaey - aexdey;
    const aexcey = aex * cey;
    const cexaey = cex * aey;
    const ac = aexcey - cexaey;
    const bexdey = bex * dey;
    const dexbey = dex * bey;
    const bd = bexdey - dexbey;

    const alift = aex * aex + aey * aey + aez * aez;
    const blift = bex * bex + bey * bey + bez * bez;
    const clift = cex * cex + cey * cey + cez * cez;
    const dlift = dex * dex + dey * dey + dez * dez;

    const det =
        (clift * (dez * ab + aez * bd + bez * da) - dlift * (aez * bc - bez * ac + cez * ab)) +
        (alift * (bez * cd - cez * bd + dez * bc) - blift * (cez * da + dez * ac + aez * cd));

    const aezplus = Math.abs(aez);
    const bezplus = Math.abs(bez);
    const cezplus = Math.abs(cez);
    const dezplus = Math.abs(dez);
    const aexbeyplus = Math.abs(aexbey) + Math.abs(bexaey);
    const bexceyplus = Math.abs(bexcey) + Math.abs(cexbey);
    const cexdeyplus = Math.abs(cexdey) + Math.abs(dexcey);
    const dexaeyplus = Math.abs(dexaey) + Math.abs(aexdey);
    const aexceyplus = Math.abs(aexcey) + Math.abs(cexaey);
    const bexdeyplus = Math.abs(bexdey) + Math.abs(dexbey);
    const permanent =
        (cexdeyplus * bezplus + bexdeyplus * cezplus + bexceyplus * dezplus) * alift +
        (dexaeyplus * cezplus + aexceyplus * dezplus + cexdeyplus * aezplus) * blift +
        (aexbeyplus * dezplus + bexdeyplus * aezplus + dexaeyplus * bezplus) * clift +
        (bexceyplus * aezplus + aexceyplus * bezplus + aexbeyplus * cezplus) * dlift;

    const errbound = isperrboundA * permanent;
    if (det > errbound || -det > errbound) {
        return det;
    }
    return -insphereadapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, ex, ey, ez, permanent);
}

function inspherefast(pax, pay, paz, pbx, pby, pbz, pcx, pcy, pcz, pdx, pdy, pdz, pex, pey, pez) {
    const aex = pax - pex;
    const bex = pbx - pex;
    const cex = pcx - pex;
    const dex = pdx - pex;
    const aey = pay - pey;
    const bey = pby - pey;
    const cey = pcy - pey;
    const dey = pdy - pey;
    const aez = paz - pez;
    const bez = pbz - pez;
    const cez = pcz - pez;
    const dez = pdz - pez;

    const ab = aex * bey - bex * aey;
    const bc = bex * cey - cex * bey;
    const cd = cex * dey - dex * cey;
    const da = dex * aey - aex * dey;
    const ac = aex * cey - cex * aey;
    const bd = bex * dey - dex * bey;

    const abc = aez * bc - bez * ac + cez * ab;
    const bcd = bez * cd - cez * bd + dez * bc;
    const cda = cez * da + dez * ac + aez * cd;
    const dab = dez * ab + aez * bd + bez * da;

    const alift = aex * aex + aey * aey + aez * aez;
    const blift = bex * bex + bey * bey + bez * bez;
    const clift = cex * cex + cey * cey + cez * cez;
    const dlift = dex * dex + dey * dey + dez * dez;

    return (clift * dab - dlift * abc) + (alift * bcd - blift * cda);
}

module.exports = {
    insphere,
    inspherefast,
};
