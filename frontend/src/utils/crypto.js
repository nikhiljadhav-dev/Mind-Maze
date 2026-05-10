import CryptoJS from 'crypto-js';

const CRYPTO_SECRET = import.meta.env.VITE_CRYPTO_SECRET || 'logic-looper-default-secret';

export function encrypt(data) {
  const json = JSON.stringify(data);
  return CryptoJS.AES.encrypt(json, CRYPTO_SECRET).toString();
}

export function decrypt(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_SECRET);
    const json = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function hashData(data) {
  return CryptoJS.SHA256(JSON.stringify(data)).toString(CryptoJS.enc.Hex);
}
