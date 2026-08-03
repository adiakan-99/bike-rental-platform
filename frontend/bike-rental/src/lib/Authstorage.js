// "Remember me" decides WHERE the JWT (and userId/firstName) live:
//   remembered = true  -> localStorage    (survives closing the browser)
//   remembered = false -> sessionStorage  (cleared when the tab/window closes)
// Every authenticated call reads the token through getToken(), so it works no matter
// which store holds it. Only ever one store holds a given key at a time.
const KEYS = ["token", "userId", "firstName"];

export const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const getAuthItem = (key) =>
  localStorage.getItem(key) ?? sessionStorage.getItem(key);

// Write auth items to the chosen store and remove them from the other, so a later
// login with a different "remember" choice can't leave a stale token behind.
export const setAuth = (items, remember) => {
  const store = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;
  Object.entries(items).forEach(([k, v]) => {
    store.setItem(k, v == null ? "" : String(v));
    other.removeItem(k);
  });
};

// Full logout / invalid-token cleanup — clear from both stores.
export const clearAuth = () => {
  KEYS.forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
};
