import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import {
  AppDatabase,
  WebsiteContent,
  AdminAuditLog,
  VisitorTelemetry,
  LeadSubmission,
} from './types';
import { initialContent } from '@/data/initial-content';

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

let memoryDb: AppDatabase | null = null;
let writeQueue = Promise.resolve();

function createInitialDb(): AppDatabase {
  return {
    siteContent: initialContent,
    adminAuditLogs: [
      {
        id: 'audit-seed-1',
        adminName: 'Zavian Super Admin',
        adminEmail: 'admin@zavianlabs.com',
        adminPhone: '+1 (555) 019-2834',
        loginAt: new Date(Date.now() - 3600000).toISOString(),
        loginFormatted: new Date(Date.now() - 3600000).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        ipAddress: '127.0.0.1',
        city: 'Localhost Dev',
        region: 'Sindh',
        country: 'Pakistan',
        status: 'SUCCESS',
        userAgent: 'SuperAdmin CLI / Web Init',
      },
    ],
    visitorTelemetry: [
      {
        visitorId: 'vid-seed-demo-1',
        ipAddress: '127.0.0.1',
        city: 'Localhost Dev',
        region: 'Sindh',
        country: 'Pakistan',
        visitCount: 3,
        firstSeenAt: new Date(Date.now() - 86400000).toISOString(),
        lastVisitedAt: new Date().toISOString(),
        currentPage: '/',
        referrer: 'Direct',
        deviceType: 'Desktop',
        browser: 'Edge',
      },
    ],
    leadSubmissions: [],
  };
}

/**
 * Retrieve database instance from memory or disk.
 */
export async function getDb(): Promise<AppDatabase> {
  if (memoryDb) {
    return memoryDb;
  }

  const isVercel = process.env.VERCEL === '1';
  const tmpPath = path.join(os.tmpdir(), 'zavian_db.json');

  // 1. Try reading from /tmp on Vercel if updated
  if (isVercel) {
    try {
      const rawTmp = await fs.readFile(tmpPath, 'utf-8');
      const parsedTmp: AppDatabase = JSON.parse(rawTmp);
      if (parsedTmp && parsedTmp.siteContent) {
        memoryDb = parsedTmp;
        return parsedTmp;
      }
    } catch {}
  }

  // 2. Try reading from project db.json
  try {
    const rawData = await fs.readFile(DB_FILE_PATH, 'utf-8');
    const parsed: AppDatabase = JSON.parse(rawData);

    // Merge fallback if schema evolved
    if (!parsed.siteContent || !parsed.siteContent.header) {
      parsed.siteContent = { ...initialContent, ...parsed.siteContent };
    }
    if (!parsed.siteContent.themeBranding) {
      parsed.siteContent.themeBranding = initialContent.themeBranding;
    }
    if (!parsed.adminAuditLogs) parsed.adminAuditLogs = [];
    if (!parsed.visitorTelemetry) parsed.visitorTelemetry = [];
    if (!parsed.leadSubmissions) parsed.leadSubmissions = [];

    memoryDb = parsed;
    return parsed;
  } catch (error: unknown) {
    // If not found or read-only, safely use initial in-memory state
    const fallback = createInitialDb();
    memoryDb = fallback;
    return fallback;
  }
}

/**
 * Write database atomically to disk (safe for Vercel read-only filesystem).
 */
export async function saveDb(data: AppDatabase): Promise<void> {
  memoryDb = data;

  writeQueue = writeQueue.then(async () => {
    try {
      const isVercel = process.env.VERCEL === '1';
      const targetPath = isVercel ? path.join(os.tmpdir(), 'zavian_db.json') : DB_FILE_PATH;
      const dataDir = path.dirname(targetPath);

      await fs.mkdir(dataDir, { recursive: true }).catch(() => {});

      const tempFilePath = `${targetPath}.tmp.${Date.now()}`;
      const serialized = JSON.stringify(data, null, 2);

      try {
        await fs.writeFile(tempFilePath, serialized, 'utf-8');
        try {
          await fs.rename(tempFilePath, targetPath);
        } catch {
          await fs.copyFile(tempFilePath, targetPath);
          await fs.unlink(tempFilePath).catch(() => {});
        }
      } catch (writeErr) {
        await fs.unlink(tempFilePath).catch(() => {});
        // Fallback to /tmp if primary failed
        if (!isVercel) {
          const fallbackPath = path.join(os.tmpdir(), 'zavian_db.json');
          await fs.writeFile(fallbackPath, serialized, 'utf-8').catch(() => {});
        }
      }
    } catch (err) {
      console.warn('saveDb non-fatal error:', err);
    }
  }).catch(() => {
    writeQueue = Promise.resolve();
  });

  return writeQueue;
}

// ==========================================
// Site Content Queries & Updates
// ==========================================
export async function getSiteContent(): Promise<WebsiteContent> {
  const db = await getDb();
  return db.siteContent || initialContent;
}

export async function updateSiteContent(
  updater: (prev: WebsiteContent) => WebsiteContent
): Promise<WebsiteContent> {
  const db = await getDb();
  const updatedContent = updater(db.siteContent);
  db.siteContent = updatedContent;
  await saveDb(db);
  return updatedContent;
}

// ==========================================
// Admin Audit Trail Logging
// ==========================================
export async function logAdminLogin(entry: Omit<AdminAuditLog, 'id'>): Promise<AdminAuditLog> {
  const db = await getDb();
  const newLog: AdminAuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...entry,
  };

  db.adminAuditLogs.unshift(newLog);
  // Cap at 200 logs
  if (db.adminAuditLogs.length > 200) {
    db.adminAuditLogs = db.adminAuditLogs.slice(0, 200);
  }

  await saveDb(db);
  return newLog;
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  const db = await getDb();
  return db.adminAuditLogs || [];
}

// ==========================================
// Visitor Telemetry Intelligence
// ==========================================
export async function recordVisitorTelemetry(
  data: Omit<VisitorTelemetry, 'firstSeenAt' | 'lastVisitedAt' | 'visitCount'>
): Promise<VisitorTelemetry> {
  const db = await getDb();
  const existingIndex = db.visitorTelemetry.findIndex((v) => v.visitorId === data.visitorId);
  const now = new Date().toISOString();

  let recorded: VisitorTelemetry;

  if (existingIndex >= 0) {
    const existing = db.visitorTelemetry[existingIndex];
    recorded = {
      ...existing,
      ...data,
      visitCount: (existing.visitCount || 1) + 1,
      lastVisitedAt: now,
    };
    db.visitorTelemetry[existingIndex] = recorded;
  } else {
    recorded = {
      ...data,
      firstSeenAt: now,
      lastVisitedAt: now,
      visitCount: 1,
    };
    db.visitorTelemetry.unshift(recorded);
  }

  // Keep max 500 active visitors
  if (db.visitorTelemetry.length > 500) {
    db.visitorTelemetry = db.visitorTelemetry.slice(0, 500);
  }

  await saveDb(db);
  return recorded;
}

export async function getVisitorTelemetry(): Promise<VisitorTelemetry[]> {
  const db = await getDb();
  return db.visitorTelemetry || [];
}

// ==========================================
// Lead Submissions with Stitched Telemetry
// ==========================================
export async function recordLeadSubmission(
  lead: Omit<LeadSubmission, 'id' | 'timestamp' | 'visitCountAtSubmission'>
): Promise<LeadSubmission> {
  const db = await getDb();
  const now = new Date().toISOString();

  // Find visitor telemetry to stitch historical visit frequency
  const visitor = lead.visitorId
    ? db.visitorTelemetry.find((v) => v.visitorId === lead.visitorId)
    : null;

  const newLead: LeadSubmission = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...lead,
    timestamp: now,
    visitCountAtSubmission: visitor ? visitor.visitCount : 1,
  };

  db.leadSubmissions.unshift(newLead);
  await saveDb(db);
  return newLead;
}

export async function getLeadSubmissions(): Promise<LeadSubmission[]> {
  const db = await getDb();
  return db.leadSubmissions || [];
}
