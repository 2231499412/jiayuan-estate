// 使用 Web Crypto API 的 PBKDF2，Workers 内置支持

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  const saltB64 = btoa(String.fromCharCode(...salt));
  return `pbkdf2:100000:${saltB64}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, iterations, saltB64, hashB64] = stored.split(':');
  if (algo !== 'pbkdf2') return false;
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: parseInt(iterations), hash: 'SHA-256' }, key, 256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return hash === hashB64;
}
