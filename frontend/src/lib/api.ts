export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function getImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // If it's invalid text mistakenly set as logo/url (e.g. "Logo" or "SANUSHA" without / or http), return empty
  if (
    !trimmed.startsWith('/') &&
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://') &&
    !trimmed.startsWith('data:') &&
    !trimmed.startsWith('blob:')
  ) {
    return '';
  }

  // Local public images should load directly from the Next.js static asset public directory
  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }

  const backendHost = API_BASE_URL.replace(/\/api\/?$/, '');

  if (trimmed.startsWith('http://localhost:5000') || trimmed.startsWith('http://127.0.0.1:5000')) {
    return trimmed.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, backendHost);
  }

  if (trimmed.startsWith('/uploads/')) {
    return `${backendHost}${trimmed}`;
  }

  return trimmed;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sanusha_customer_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}
