import React from 'react';
import { getStorefrontContent } from '@/lib/siteContent';
import HomeClient from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await getStorefrontContent();
  return <HomeClient content={content} />;
}
