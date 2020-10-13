/* eslint-disable no-bitwise */
export const serializePath = (path: Array<number>): Buffer => {
  if (path == null || path.length < 3) {
    throw new Error('Invalid path.');
  }
  if (path.length > 10) {
    throw new Error('Invalid path. Length should be <= 10');
  }
  const buf = Buffer.alloc(path.length * 4 + 1);
  buf.writeUInt8(path.length, 0);
  for (let i = 0; i < path.length; i += 1) {
    let v = path[i];
    if (i < 3) {
      v |= 0x80000000; // Harden
    }
    buf.writeInt32LE(v, i * 4 + 1);
  }
  return buf;
};
