export type ApiOptions = {
  token?: string | null;
};

const BASE = ""; // use vite proxy to backend

export function createApiClient(options: ApiOptions = {}) {
  const { token } = options;
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...headers, ...(init?.headers as any) } });
    if (!res.ok) {
      let err: any;
      try { err = await res.json(); } catch { err = { error: res.statusText }; }
      const message = err.error || err.message || err.detail || res.statusText;
      throw new Error(message);
    }
    return res.json();
  }
  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: any) => request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  };
}


