import CryptoJS from 'crypto-js';

const encryptionKeyHex = process.env.ENCRYPTION_KEY;
const ivHex = process.env.IV;

if (!encryptionKeyHex || !ivHex) {
  throw new Error("ENCRYPTION_KEY or IV is not defined in environment variables");
}

const encryptionKey = CryptoJS.enc.Hex.parse(encryptionKeyHex); // คีย์ 32 ไบต์สำหรับ AES-256
const iv = CryptoJS.enc.Hex.parse(ivHex); // IV ที่มีขนาด 16 ไบต์ (128 บิต)

export function encrypt(text) {
  const encrypted = CryptoJS.AES.encrypt(text, encryptionKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return encrypted;
}

export function decrypt(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, encryptionKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}
