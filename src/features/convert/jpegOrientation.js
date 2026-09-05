// Read only bounded JPEG APP1 metadata. Pixel decoding/rotation remains with
// the browser or FFmpeg; layout and resize must use those upright dimensions.
export function readJpegOrientation(prefix) {
  const bytes = (prefix instanceof Uint8Array ? prefix : new Uint8Array(prefix)).subarray(0,64 * 1024)
  if (bytes[0] !== 255 || bytes[1] !== 216) return 1
  const view = new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength)
  let offset = 2
  while (offset + 4 <= bytes.length) {
    if (bytes[offset++] !== 255) return 1
    while (bytes[offset] === 255) offset++
    const marker = bytes[offset++]
    if (marker === 0xda || marker === 0xd9) return 1
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
    if (offset + 2 > bytes.length) return 1
    const length = view.getUint16(offset,false), start = offset + 2, end = offset + length
    if (length < 2 || end > bytes.length) return 1
    if (marker === 0xe1 && end - start >= 14 && [69,120,105,102,0,0].every((value,index) => bytes[start + index] === value)) {
      const tiff = start + 6
      const little = bytes[tiff] === 73 && bytes[tiff + 1] === 73
      const big = bytes[tiff] === 77 && bytes[tiff + 1] === 77
      if ((little || big) && view.getUint16(tiff + 2,little) === 42) {
        const ifd = tiff + view.getUint32(tiff + 4,little)
        if (ifd >= tiff + 8 && ifd + 2 <= end) {
          const count = Math.min(view.getUint16(ifd,little),Math.floor((end - ifd - 2) / 12))
          for (let index = 0; index < count; index++) {
            const entry = ifd + 2 + index * 12
            if (view.getUint16(entry,little) === 0x0112 && view.getUint16(entry + 2,little) === 3 && view.getUint32(entry + 4,little) === 1) {
              const orientation = view.getUint16(entry + 8,little)
              if (orientation >= 1 && orientation <= 8) return orientation
            }
          }
        }
      }
    }
    offset = end
  }
  return 1
}
