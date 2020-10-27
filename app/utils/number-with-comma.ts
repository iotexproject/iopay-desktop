export const numberWithCommas = (n: string): string => {
  return n
    .toString()
    .replace(/\,/g, "")
    .split(".")
    .map((part, index) =>
      index === 0 ? part.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : part
    )
    .join(".");
}

export const numberFromCommaString = (n: string): string => {
  if (!n) {
    return n;
  }
  return n.toString().replace(/\,/g, "");
}

export const hexToBytes = (hexStr: string): Array<number> => {
  const matches = hexStr.match(/^(0x)?([0-9a-fA-F]*)$/);
  if (!matches || matches.length < 3) {
    throw new Error(`Given value "${hexStr}" is not a valid hex string.`);
  }

  const hex = matches[2].length % 2 ? `0${matches[2]}` : matches[2];

  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

  return bytes;
}
