import { headers } from 'next/headers';

export interface GeoLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
}

const LOCAL_FALLBACK: GeoLocation = {
  ip: '127.0.0.1',
  city: 'Localhost Dev',
  region: 'Sindh',
  country: 'Pakistan',
};

/**
 * Resolve client IP and geographic location from Next.js incoming request headers.
 */
export async function resolveGeoLocation(customHeaders?: Headers): Promise<GeoLocation> {
  const reqHeaders = customHeaders || (await headers());

  // 1. Extract IP
  const forwardedFor = reqHeaders.get('x-forwarded-for');
  const realIp = reqHeaders.get('x-real-ip');
  let clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  // Strip IPv6 prefix if present (e.g., ::ffff:127.0.0.1)
  if (clientIp.startsWith('::ffff:')) {
    clientIp = clientIp.substring(7);
  }

  // 2. Check for local/private IPs
  const isLocal =
    clientIp === '127.0.0.1' ||
    clientIp === '::1' ||
    clientIp === 'localhost' ||
    clientIp.startsWith('192.168.') ||
    clientIp.startsWith('10.') ||
    clientIp.startsWith('172.16.');

  if (isLocal) {
    return {
      ...LOCAL_FALLBACK,
      ip: clientIp,
    };
  }

  // 3. Inspect Cloudflare / Vercel Edge geo headers
  const cfCountry = reqHeaders.get('cf-ipcountry');
  const vercelCountry = reqHeaders.get('x-vercel-ip-country');
  const vercelCity = reqHeaders.get('x-vercel-ip-city');
  const vercelRegion = reqHeaders.get('x-vercel-ip-country-region');

  if (vercelCountry || cfCountry) {
    return {
      ip: clientIp,
      city: vercelCity ? decodeURIComponent(vercelCity) : 'Metropolis',
      region: vercelRegion ? decodeURIComponent(vercelRegion) : 'Global',
      country: vercelCountry || cfCountry || 'Unknown',
    };
  }

  // 4. Fallback lightweight lookup for public IP with 1.5s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,regionName,city`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          ip: clientIp,
          city: data.city || 'Unknown',
          region: data.regionName || 'Unknown',
          country: data.country || 'Unknown',
        };
      }
    }
  } catch {
    // Timeout or network lookup error - fallback gracefully
  }

  return {
    ip: clientIp,
    city: 'Global Visitor',
    region: 'Network Edge',
    country: 'International',
  };
}
