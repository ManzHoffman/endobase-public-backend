// encrypt.js
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

// returns a single Buffer: [iv][authTag][ciphertext]
function encryptBuffer(buffer) {
    const keyHex = process.env.MEDIQ_ENC_KEY;
    if (!keyHex) {
        throw new Error('MEDIQ_ENC_KEY is not set');
    }

    const key = Buffer.from(keyHex, 'hex');
    if (key.length !== 32) {
        throw new Error('MEDIQ_ENC_KEY must be 32 bytes (64 hex chars)');
    }

    // GCM typically uses 12-byte IVs
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const ciphertext = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Concatenate iv + authTag + ciphertext for storage/transmission
    return Buffer.concat([iv, authTag, ciphertext]);
}

// optional: decryption helper for whoever will read the file
function decryptBuffer(encryptedBuffer) {
    const keyHex = process.env.MEDIQ_ENC_KEY;
    const key = Buffer.from(keyHex, 'hex');

    const iv = encryptedBuffer.subarray(0, 12);
    const authTag = encryptedBuffer.subarray(12, 28);
    const ciphertext = encryptedBuffer.subarray(28);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

module.exports = { encryptBuffer, decryptBuffer };
