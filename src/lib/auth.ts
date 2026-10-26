export interface AdminSessionPayload {
  name: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN';
  iat: number;
  exp: number;
}

export const ADMIN_COOKIE_NAME = 'zavian_admin_session';

const DEFAULT_JWT_SECRET = 'zavian_super_secret_jwt_key_987654321_production';

function getJwtSecret(): string {
  return process.env.ADMIN_JWT_SECRET || DEFAULT_JWT_SECRET;
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

async function getKey(): Promise<CryptoKey> {
  const secret = getJwtSecret();
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Sign an HMAC-SHA256 session token using the Web Crypto API.
 */
export async function createAdminSessionToken(
  adminInfo: { name: string; email: string; phone?: string }
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    name: adminInfo.name,
    email: adminInfo.email,
    phone: adminInfo.phone,
    role: 'SUPER_ADMIN',
    iat: now,
    exp: now + 60 * 60 * 24 * 7, // 7 days
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(dataToSign)
  );

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureBinary = String.fromCharCode(...signatureArray);
  const encodedSignature = base64UrlEncode(signatureBinary);

  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Verify HMAC-SHA256 session token using Web Crypto API.
 */
export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<AdminSessionPayload | null> {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    const key = await getKey();
    const signatureBinary = base64UrlDecode(encodedSignature);
    const signatureBytes = new Uint8Array(
      signatureBinary.split('').map((c) => c.charCodeAt(0))
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(dataToVerify)
    );

    if (!isValid) return null;

    const payload: AdminSessionPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Get configured Super Admin credentials from environment.
 */
export function getSuperAdminCredentials() {
  return {
    name: process.env.SUPER_ADMIN_NAME || 'Zavian Super Admin',
    email: (process.env.SUPER_ADMIN_EMAIL || 'admin@zavianlabs.com').toLowerCase(),
    phone: process.env.SUPER_ADMIN_PHONE || '+1 (555) 019-2834',
    password: process.env.SUPER_ADMIN_PASSWORD || 'Megatron_@0047',
  };
}

/**
 * Validate credentials against configured Super Admin.
 */
export function verifyCredentials(email: string, password: string): { valid: boolean; adminInfo?: { name: string; email: string; phone: string } } {
  const creds = getSuperAdminCredentials();
  const normalizedInputEmail = (email || '').trim().toLowerCase();
  const normalizedAdminEmail = creds.email.trim().toLowerCase();

  if (normalizedInputEmail === normalizedAdminEmail && password === creds.password) {
    return {
      valid: true,
      adminInfo: {
        name: creds.name,
        email: creds.email,
        phone: creds.phone,
      },
    };
  }

  return { valid: false };
}
