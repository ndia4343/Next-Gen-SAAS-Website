import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { SiteConfig } from '@/types/site-config';
import { defaultConfig } from '@/lib/default-config';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'site-config.json');

let memorySiteConfig: SiteConfig | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function mergeWithDefaults(partial: Partial<SiteConfig> | null | undefined): SiteConfig {
  if (!partial) return defaultConfig;

  return {
    branding: { ...defaultConfig.branding, ...(partial.branding || {}) },
    hero: { ...defaultConfig.hero, ...(partial.hero || {}) },
    marquee: {
      ...defaultConfig.marquee,
      ...(partial.marquee || {}),
      items:
        Array.isArray(partial.marquee?.items) && partial.marquee.items.length > 0
          ? partial.marquee.items
          : defaultConfig.marquee.items,
    },
    voiceTheatre: {
      ...defaultConfig.voiceTheatre,
      ...(partial.voiceTheatre || {}),
      industries:
        Array.isArray(partial.voiceTheatre?.industries) && partial.voiceTheatre.industries.length > 0
          ? partial.voiceTheatre.industries
          : defaultConfig.voiceTheatre.industries,
    },
    constellation: {
      ...defaultConfig.constellation,
      ...(partial.constellation || {}),
      coreNodeSpecs:
        Array.isArray(partial.constellation?.coreNodeSpecs) &&
        partial.constellation.coreNodeSpecs.length > 0
          ? partial.constellation.coreNodeSpecs
          : defaultConfig.constellation.coreNodeSpecs,
      nodes:
        Array.isArray(partial.constellation?.nodes) && partial.constellation.nodes.length > 0
          ? partial.constellation.nodes
          : defaultConfig.constellation.nodes,
    },
    telemetry: {
      ...defaultConfig.telemetry,
      ...(partial.telemetry || {}),
      sectors:
        Array.isArray(partial.telemetry?.sectors) && partial.telemetry.sectors.length > 0
          ? partial.telemetry.sectors
          : defaultConfig.telemetry.sectors,
    },
  };
}

export async function getServerSiteConfig(): Promise<SiteConfig> {
  if (memorySiteConfig) {
    return memorySiteConfig;
  }

  const isVercel = process.env.VERCEL === '1';
  const tmpPath = path.join(os.tmpdir(), 'zavian_site_config.json');

  if (isVercel) {
    try {
      const rawTmp = await fs.readFile(tmpPath, 'utf-8');
      const parsedTmp = JSON.parse(rawTmp) as Partial<SiteConfig>;
      const merged = mergeWithDefaults(parsedTmp);
      memorySiteConfig = merged;
      return merged;
    } catch {
      // fall through
    }
  }

  try {
    const raw = await fs.readFile(CONFIG_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SiteConfig>;
    const merged = mergeWithDefaults(parsed);
    memorySiteConfig = merged;
    return merged;
  } catch {
    memorySiteConfig = defaultConfig;
    return defaultConfig;
  }
}

export async function saveServerSiteConfig(nextConfig: SiteConfig): Promise<SiteConfig> {
  const merged = mergeWithDefaults(nextConfig);
  memorySiteConfig = merged;

  writeQueue = writeQueue
    .then(async () => {
      const isVercel = process.env.VERCEL === '1';
      const targetPath = isVercel
        ? path.join(os.tmpdir(), 'zavian_site_config.json')
        : CONFIG_FILE_PATH;
      const dir = path.dirname(targetPath);

      await fs.mkdir(dir, { recursive: true }).catch(() => {});
      const tmpWrite = `${targetPath}.tmp.${Date.now()}`;
      const payload = JSON.stringify(merged, null, 2);

      try {
        await fs.writeFile(tmpWrite, payload, 'utf-8');
        try {
          await fs.rename(tmpWrite, targetPath);
        } catch {
          await fs.copyFile(tmpWrite, targetPath);
          await fs.unlink(tmpWrite).catch(() => {});
        }
      } catch {
        await fs.unlink(tmpWrite).catch(() => {});
        if (!isVercel) {
          const fallbackTmp = path.join(os.tmpdir(), 'zavian_site_config.json');
          await fs.writeFile(fallbackTmp, payload, 'utf-8').catch(() => {});
        }
      }
    })
    .catch(() => {
      writeQueue = Promise.resolve();
    });

  await writeQueue;
  return merged;
}
