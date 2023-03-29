export { intoUD, fromUD };

const precision = 1e18;

/**
 * Transforms the parameter moving the comma so it can be used as a smart contracts unsigned decimal.
 * @param x the number to convert to smart contracts unsigned decimal.
 * @returns an smart contracts unsigned decimal.
 */
function intoUD(x: number): bigint {
    return BigInt(x * precision);
}

/**
 * Transforms the parameter moving the comma so it can be used as a typescript decimal.
 * @param x the unsigned decimal to convert to typescript decimal.
 * @returns a typescript decimal
 */
function fromUD(x: bigint): bigint {
    // Casting to unknown first because warnings
    return x / (precision as unknown as bigint);
}
