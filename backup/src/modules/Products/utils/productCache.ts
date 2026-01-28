/**
 * Utilitários de cache para produtos
 */

export const productCache = {
  get: (key: string) => {
    return localStorage.getItem(key);
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string) => {
    localStorage.removeItem(key);
  }
};

export const variationsCache = {
  get: (key: string) => {
    return localStorage.getItem(key);
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const imagesCache = {
  get: (key: string) => {
    return localStorage.getItem(key);
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const cacheUtils = {
  clear: () => {
    localStorage.clear();
  },
  size: () => {
    return localStorage.length;
  }
};