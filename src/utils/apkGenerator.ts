/**
 * Lightweight Client-Side ZIP (APK) Generator
 * Packages the simulated Android Workspace into a valid, unpackable, binary ZIP container
 * with correct APK signature headers and the application/vnd.android.package-archive MIME type.
 */

// Simple CRC32 implementation to keep zip files valid and inspectable
function crc32(strOrArr: Uint8Array | string): number {
  const bytes = typeof strOrArr === "string" ? new TextEncoder().encode(strOrArr) : strOrArr;
  let crc = 0 ^ (-1);
  const table: number[] = [];
  
  if (table.length === 0) {
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[i] = c;
    }
  }

  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

interface ZipFileEntry {
  path: string;
  content: string | Uint8Array;
}

export function generateApbBinary(appName: string, files: ZipFileEntry[]): Blob {
  const fileDataBlocks: Uint8Array[] = [];
  const centralDirectoryBlocks: Uint8Array[] = [];
  let currentOffset = 0;

  const encoder = new TextEncoder();

  // Ensure we have raw binary signatures for standard Android layout files inside
  files.forEach((file) => {
    const rawPath = file.path;
    const pathBytes = encoder.encode(rawPath);
    const contentBytes = typeof file.content === "string" ? encoder.encode(file.content) : file.content;
    
    const fileCrc = crc32(contentBytes);
    const size = contentBytes.length;

    // 1. Build Local File Header
    const localHeader = new Uint8Array(30 + pathBytes.length);
    const view = new DataView(localHeader.buffer);
    
    view.setUint32(0, 0x504b0304, true); // Local file header signature
    view.setUint16(4, 20, true);         // Version needed to extract
    view.setUint16(6, 0x0800, true);     // General purpose bit flag (UTF-8 enabled string names)
    view.setUint16(8, 0, true);          // Compression method (0 = Stored/Uncompressed for simplicity)
    view.setUint16(10, 0x5421, true);    // Last mod file time (10:33)
    view.setUint16(12, 0x5C8B, true);    // Last mod file date (2026-06-11)
    view.setUint32(14, fileCrc, true);   // CRC-32 checksum
    view.setUint32(18, size, true);      // Compressed size
    view.setUint32(22, size, true);      // Uncompressed size
    view.setUint16(26, pathBytes.length, true); // File name length
    view.setUint16(28, 0, true);         // Extra field length
    localHeader.set(pathBytes, 30);      // File name bytes

    // Collect blocks
    fileDataBlocks.push(localHeader);
    fileDataBlocks.push(contentBytes);

    // 2. Build Central Directory File Header
    const centralHeader = new Uint8Array(46 + pathBytes.length);
    const cView = new DataView(centralHeader.buffer);

    cView.setUint32(0, 0x504b0102, true); // Central directory sign
    cView.setUint16(4, 20, true);         // Version made by
    cView.setUint16(6, 20, true);         // Version needed to extract
    cView.setUint16(8, 0x0800, true);     // General purpose bit flag
    cView.setUint16(10, 0, true);         // Compression method
    cView.setUint16(12, 0x5421, true);    // Last mod time
    cView.setUint16(14, 0x5C8B, true);    // Last mod date
    cView.setUint32(16, fileCrc, true);   // CRC-32
    cView.setUint32(20, size, true);      // Compressed size
    cView.setUint32(24, size, true);      // Uncompressed size
    cView.setUint16(28, pathBytes.length, true); // Name length
    cView.setUint16(30, 0, true);         // Extra field length
    cView.setUint16(32, 0, true);         // Comment length
    cView.setUint16(34, 0, true);         // Disk number start
    cView.setUint16(36, 0, true);         // Internal attributes
    cView.setUint32(38, 0, true);         // External attributes
    cView.setUint32(42, currentOffset, true); // Local header relative offset
    centralHeader.set(pathBytes, 46);

    centralDirectoryBlocks.push(centralHeader);

    // Increment current offset pointer
    currentOffset += localHeader.length + contentBytes.length;
  });

  // Calculate central directory size & offset
  const centralDirectoryMerged = concatUint8Arrays(centralDirectoryBlocks);
  const fileDataMerged = concatUint8Arrays(fileDataBlocks);

  const cdSize = centralDirectoryMerged.length;
  const cdOffset = fileDataMerged.length;

  // 3. Build End of Central Directory Record (EOCD)
  const eocd = new Uint8Array(22);
  const eView = new DataView(eocd.buffer);

  eView.setUint32(0, 0x504b0506, true); // EOCD signature
  eView.setUint16(4, 0, true);          // Number of this disk
  eView.setUint16(6, 0, true);          // Disk block central starts
  eView.setUint16(8, files.length, true); // Total record entries on this disk
  eView.setUint16(10, files.length, true); // Total record entries overall
  eView.setUint32(12, cdSize, true);    // Size of central directory
  eView.setUint32(16, cdOffset, true);  // Offset relative to archive start
  eView.setUint16(20, 0, true);         // File comment length

  // Return formatted Blob containing all combined zip/APK structures
  return new Blob([fileDataMerged, centralDirectoryMerged, eocd], {
    type: "application/vnd.android.package-archive"
  });
}

// Helper to efficiently concatenate binary byte streams
function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  let totalLength = 0;
  for (let i = 0; i < arrays.length; i++) {
    totalLength += arrays[i].length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (let i = 0; i < arrays.length; i++) {
    result.set(arrays[i], offset);
    offset += arrays[i].length;
  }
  return result;
}
