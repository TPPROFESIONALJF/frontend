export { }

declare global {
  interface BigInt {
    asTokenStandardUnit(): bigint;
    asTokenSmallestUnit(): bigint;
  }

  interface Number {
    asTokenSmallestUnit(): bigint;
  }
}

BigInt.prototype.asTokenStandardUnit = function (): bigint {
  return (this as bigint) / BigInt(1e18);
}

BigInt.prototype.asTokenSmallestUnit = function (): bigint {
  return (this as bigint) * BigInt(1e18);
}

Number.prototype.asTokenSmallestUnit = function (): bigint {
  return BigInt(this as number) * BigInt(1e18);
}
