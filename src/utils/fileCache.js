import fs from "fs";

const cache = {};
const TTL = 15 * 60 * 1000; // 15 minutes

export function getLocalPath(bookId) {
  return `/tmp/${bookId}.pdf`;
}

export function isCached(bookId) {
  const file = cache[bookId];

  if (!file) return false;

  // update last used
  file.lastUsed = Date.now();

  return fs.existsSync(file.path);
}

export function addToCache(bookId, path) {
  cache[bookId] = {
    path,
    lastUsed: Date.now(),
  };

  //  auto delete after TTL
  setTimeout(() => {
    if (cache[bookId]) {
      try {
        fs.unlinkSync(path);
      } catch {}

      delete cache[bookId];
    }
  }, TTL);
}

export function getPath(bookId) {
  return cache[bookId]?.path;
}