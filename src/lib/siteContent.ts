import { getSiteContent as getDbSiteContent } from '@/lib/db';
import { initialContent } from '@/data/initial-content';
import { WebsiteContent } from '@/lib/types';

/**
 * Fetch active website content for front-end consumption with instant fallback.
 */
export async function getStorefrontContent(): Promise<WebsiteContent> {
  try {
    const content = await getDbSiteContent();
    return content || initialContent;
  } catch (err) {
    console.error('getStorefrontContent error, using fallback initialContent:', err);
    return initialContent;
  }
}
