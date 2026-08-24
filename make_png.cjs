const fs = require('fs');
const zlib = require('zlib');

function makePNG(width, height) {
    const rawData = Buffer.alloc(height * (1 + width * 4));
    let pos = 0;
    
    for (let y = 0; y < height; y++) {
        rawData[pos++] = 0; // Filter type 0 (None)
        for (let x = 0; x < width; x++) {
            // Draw gold/amber badge with rounded corners
            const margin = Math.floor(width * 0.1);
            const isInsideBox = x >= margin && x < width - margin && y >= margin && y < height - margin;
            
            if (isInsideBox) {
                // Gold gradient (#fbbf24 to #d97706)
                const factor = y / height;
                const r = Math.floor(251 * (1 - factor) + 217 * factor);
                const g = Math.floor(191 * (1 - factor) + 119 * factor);
                const b = Math.floor(36 * (1 - factor) + 6 * factor);
                
                // Draw inner dark document symbol
                const docMarginX = Math.floor(width * 0.32);
                const docMarginY = Math.floor(height * 0.28);
                const isDoc = x >= docMarginX && x < width - docMarginX && y >= docMarginY && y < height - docMarginY;
                
                if (isDoc) {
                    rawData[pos++] = 11;  // R (#0b1120)
                    rawData[pos++] = 17;  // G
                    rawData[pos++] = 32;  // B
                    rawData[pos++] = 255; // Alpha
                } else {
                    rawData[pos++] = r;
                    rawData[pos++] = g;
                    rawData[pos++] = b;
                    rawData[pos++] = 255;
                }
            } else {
                // Outer dark background (#060911)
                rawData[pos++] = 6;
                rawData[pos++] = 9;
                rawData[pos++] = 17;
                rawData[pos++] = 255;
            }
        }
    }

    const compressed = zlib.deflateSync(rawData);

    function calcCRC(buf) {
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < buf.length; i++) {
            crc ^= buf[i];
            for (let j = 0; j < 8; j++) {
                crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
            }
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    function makeChunk(type, data) {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length, 0);
        const typeBuf = Buffer.from(type, 'binary');
        const typeAndData = Buffer.concat([typeBuf, data]);
        const crc = Buffer.alloc(4);
        crc.writeUInt32BE(calcCRC(typeAndData), 0);
        return Buffer.concat([len, typeAndData, crc]);
    }

    // Signature
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;  // bit depth
    ihdr[9] = 6;  // color type RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    const ihdrChunk = makeChunk('IHDR', ihdr);
    const idatChunk = makeChunk('IDAT', compressed);
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync('icon-192.png', makePNG(192, 192));
fs.writeFileSync('icon-512.png', makePNG(512, 512));
console.log('PNG icons created successfully!');
