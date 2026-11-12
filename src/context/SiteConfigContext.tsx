'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaqItemConfig, SiteConfig } from '@/types/site-config';
import { defaultConfig, DEFAULT_FAQ_ITEMS } from '@/lib/default-config';

function normalizeSiteConfig(incoming: SiteConfig): SiteConfig {
  const rawFaq = incoming.faq;
  const faq: FaqItemConfig[] =
    Array.isArray(rawFaq) && rawFaq.length > 0
      ? rawFaq.map((item, idx) => {
          const fallback = DEFAULT_FAQ_ITEMS[idx];
          const legacy = item as unknown as {
            id?: string;
            question?: string;
            q?: string;
            title?: string;
            answer?: string;
            a?: string;
          };
          return {
            id: legacy.id || fallback?.id || `faq-${idx + 1}`,
            question: legacy.question || legacy.q || legacy.title || fallback?.question || '',
            answer: legacy.answer || legacy.a || fallback?.answer || '',
          };
        })
      : DEFAULT_FAQ_ITEMS;

  return {
    ...defaultConfig,
    ...incoming,
    faq,
  };
}

const STORAGE_KEY = 'zavian_site_config_v1';
const BROADCAST_CHANNEL = 'zavian-site-config';

interface SaveResult {
  success: boolean;
  error?: string;
}

interface SiteConfigContextValue {
  config: SiteConfig;
  isLoading: boolean;
  isSaving: boolean;
  saveConfig: (nextConfig: SiteConfig) => Promise<SaveResult>;
  refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextValue>({
  config: defaultConfig,
  isLoading: false,
  isSaving: false,
  saveConfig: async () => ({ success: false, error: 'Provider not initialized' }),
  refreshConfig: async () => {},
});

export function useSiteConfig(): SiteConfigContextValue {
  return useContext(SiteConfigContext);
}

interface SiteConfigProviderProps {
  children: React.ReactNode;
  initialConfig?: SiteConfig;
}

export function SiteConfigProvider({
  children,
  initialConfig = defaultConfig,
}: SiteConfigProviderProps) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig>(() => normalizeSiteConfig(initialConfig));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const refreshConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/config', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.success && data?.config) {
        const normalized = normalizeSiteConfig(data.config as SiteConfig);
        setConfig(normalized);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch {}
      }
    } catch {
      // fallback gracefully to current config
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setConfig(normalizeSiteConfig(JSON.parse(e.newValue) as SiteConfig));
        } catch {}
      }
    };

    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<SiteConfig>;
      if (custom.detail) {
        setConfig(normalizeSiteConfig(custom.detail));
      }
    };

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(BROADCAST_CHANNEL);
      channel.onmessage = (event) => {
        if (event.data) {
          setConfig(normalizeSiteConfig(event.data as SiteConfig));
        }
      };
    } catch {}

    window.addEventListener('storage', handleStorage);
    window.addEventListener('zavian:site-config-updated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('zavian:site-config-updated', handleCustomEvent);
      channel?.close();
    };
  }, [refreshConfig]);

  const saveConfig = useCallback(
    async (nextConfig: SiteConfig): Promise<SaveResult> => {
      setIsSaving(true);
      try {
        const res = await fetch('/api/admin/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextConfig),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.success) {
          return {
            success: false,
            error: data?.error || `Save failed (${res.status})`,
          };
        }

        const saved = (data.config || nextConfig) as SiteConfig;
        setConfig(saved);

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
          window.dispatchEvent(new CustomEvent('zavian:site-config-updated', { detail: saved }));
          const ch = new BroadcastChannel(BROADCAST_CHANNEL);
          ch.postMessage(saved);
          ch.close();
        } catch {}

        router.refresh();
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Network error saving config';
        return { success: false, error: message };
      } finally {
        setIsSaving(false);
      }
    },
    [router]
  );

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        isLoading,
        isSaving,
        saveConfig,
        refreshConfig,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}
