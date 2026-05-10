const DB_NAME = 'LogicLooperDB';
const DB_VERSION = 1;

const STORES = {
  PUZZLE_STATE: 'puzzleState',
  PROGRESS: 'progress',
  SETTINGS: 'settings',
};

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORES.PUZZLE_STATE)) {
        db.createObjectStore(STORES.PUZZLE_STATE, { keyPath: 'date' });
      }

      if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
        const progressStore = db.createObjectStore(STORES.PROGRESS, { keyPath: 'id' });
        progressStore.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePuzzleState(date, state) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PUZZLE_STATE, 'readwrite');
    const store = tx.objectStore(STORES.PUZZLE_STATE);
    store.put({ date, ...state, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPuzzleState(date) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PUZZLE_STATE, 'readonly');
    const store = tx.objectStore(STORES.PUZZLE_STATE);
    const request = store.get(date);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveProgress(entry) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PROGRESS, 'readwrite');
    const store = tx.objectStore(STORES.PROGRESS);
    store.put({ ...entry, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getProgress(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PROGRESS, 'readonly');
    const store = tx.objectStore(STORES.PROGRESS);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllProgress() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.PROGRESS, 'readonly');
    const store = tx.objectStore(STORES.PROGRESS);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function saveSetting(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.SETTINGS, 'readwrite');
    const store = tx.objectStore(STORES.SETTINGS);
    store.put({ key, value, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getSetting(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.SETTINGS, 'readonly');
    const store = tx.objectStore(STORES.SETTINGS);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result ? request.result.value : null);
    request.onerror = () => reject(request.error);
  });
}
