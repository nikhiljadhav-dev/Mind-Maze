import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';

const SECRET = import.meta.env.VITE_CRYPTO_SECRET || 'logic-looper-default-secret';

export function getDateSeed(date = null) {
  const d = date ? dayjs(date) : dayjs();
  const dateStr = d.format('YYYY-MM-DD');
  const raw = `${dateStr}::${SECRET}`;
  const hash = CryptoJS.SHA256(raw).toString(CryptoJS.enc.Hex);
  return hash;
}

export function seedToNumber(seed, index = 0) {
  const slice = seed.slice(index * 8, index * 8 + 8);
  return parseInt(slice, 16);
}

export function getTodayDateString() {
  return dayjs().format('YYYY-MM-DD');
}

export function getPuzzleId(date = null) {
  const seed = getDateSeed(date);
  return `puzzle-${seed.slice(0, 12)}`;
}
