


export const API_BASE = import.meta.env.VITE_API_URL;

// Read JWT from localStorage and format the header
export const withAuth = () => {
  const t = localStorage.getItem('token') || '';
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// Safari-friendly fetch: no cookies for cross-site, Bearer only
export const safeFetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'omit',     // critical for Safari when using Bearer
      mode: 'cors',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...withAuth(),
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeout);
    return res;
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
};

// Optional sugar
export const postJson = (path, body, opts={}) =>
  safeFetch(`${API_BASE}${path}`, { method: 'POST', body: JSON.stringify(body), ...opts });
export const getJson = (path, opts={}) =>
  safeFetch(`${API_BASE}${path}`, { method: 'GET', ...opts });
