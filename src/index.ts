export class ValidateUTF8 {
  static is(buffer: Uint8Array): boolean {
    let currentCodePoint: number = 0;
    let bytesRemaining: number = 0;
    let byteMask: number = 0;

    for (const byte of buffer) {
      if (bytesRemaining) {
        if ((byte & 0xc0) !== 0x80) return false;

        currentCodePoint = (currentCodePoint << 6) | (byte & 0x3f);
        bytesRemaining--;

        if (bytesRemaining === 0) {
          if (
            currentCodePoint > 0x0010ffff ||
            (0xd800 <= currentCodePoint && currentCodePoint <= 0xdfff)
          )
            return false;

          if (!(currentCodePoint >> byteMask)) return false;
        }
      } else {
        if (!(byte & 0x80)) continue;

        if (
          byte === 0xff ||
          byte === 0xfe ||
          byte === 0xc0 ||
          byte === 0xc1 ||
          !(byte & 0x40)
        )
          return false;

        bytesRemaining = 1;
        byteMask = 0x20;

        while (byte & byteMask) {
          byteMask >>= 1;
          bytesRemaining++;
        }

        if (bytesRemaining >= 4) return false;

        currentCodePoint = byte & (byteMask - 1);
        byteMask = 5 * bytesRemaining + 1;
      }
    }

    return bytesRemaining === 0;
  }
}
