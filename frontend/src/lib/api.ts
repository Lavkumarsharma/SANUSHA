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

  // Base64 data URLs & Blob URLs work directly in any browser on any device
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }


  // Local public images should load directly from the Next.js static asset public directory
  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }

  const backendHost = API_BASE_URL.replace(/\/api\/?$/, '');

  let effectiveHost = backendHost;
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    (backendHost.includes('localhost') || backendHost.includes('127.0.0.1'))
  ) {
    effectiveHost = window.location.origin;
  }

  if (trimmed.startsWith('http://localhost:5000') || trimmed.startsWith('http://127.0.0.1:5000')) {
    return trimmed.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, effectiveHost);
  }

  if (trimmed.startsWith('/uploads/')) {
    return `${effectiveHost}${trimmed}`;
  }

  // Cloudinary / Edge CDN auto format (f_auto) & compression (q_auto) injection
  if (trimmed.includes('cloudinary.com') && trimmed.includes('/upload/') && !trimmed.includes('f_auto')) {
    return trimmed.replace('/upload/', '/upload/f_auto,q_auto/');
  }

  return trimmed;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}, retries = 2): Promise<any> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sanusha_customer_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (err: any) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return fetchApi(endpoint, options, retries - 1);
    }
    throw err;
  }
}
