// ✅ CUSTOM STORAGE (fixes Vite issue)
const storage = {
  getItem: (key) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
};

const persistConfig = {
  key: "root",
  storage
};

export default persistConfig;