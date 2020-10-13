import { serializePath } from './serialize-path';
import { CHUNK_SIZE } from '../constants/transport';

export const signGetChunks = (path: Array<number>, message: Uint8Array) => {
  const chunks = [] as Buffer[];
  chunks.push(serializePath(path));

  const buffer = Buffer.from(message);

  for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
    let end = i + CHUNK_SIZE;
    if (i > buffer.length) {
      end = buffer.length;
    }
    chunks.push(buffer.slice(i, end));
  }

  return chunks;
};
