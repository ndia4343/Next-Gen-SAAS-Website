import fs from 'fs/promises';
import path from 'path';
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
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      const initial = createInitialDb();
      memoryDb = initial;
      await saveDb(initial);
      return initial;
    }
    console.error('Error reading db.json, falling back to initial data:', error);
    const fallback = createInitialDb();
    memoryDb = fallback;
    return fallback;
  }
}

/**
 * Write database atomically to disk.
 */
export async function saveDb(data: AppDatabase): Promise<void> {
  memoryDb = data;

  // Queue writes sequentially to prevent concurrent file locking on Windows
  writeQueue = writeQueue.then(async () => {
    const dataDir = path.dirname(DB_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });

    const tempFilePath = `${DB_FILE_PATH}.tmp.${Date.now()}`;
    const serialized = JSON.stringify(data, null, 2);

    try {
      await fs.writeFile(tempFilePath, serialized, 'utf-8');
      try {
        await fs.rename(tempFilePath, DB_FILE_PATH);
      } catch {
        await fs.copyFile(tempFilePath, DB_FILE_PATH);
        await fs.unlink(tempFilePath).catch(() => {});
      }
    } catch (err) {
      await fs.unlink(tempFilePath).catch(() => {});
      console.error('saveDb error:', err);
    }
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
  const nextContent = updater(db.siteContent || initialContent);
  db.siteContent = nextContent;
  await saveDb(db);
  return nextContent;
}

// ==========================================
// Admin Audit Trail
// ==========================================
export async function logAdminLogin(
  entry: Omit<AdminAuditLog, 'id' | 'loginFormatted'>
): Promise<AdminAuditLog> {
  const db = await getDb();
  const dateObj = new Date(entry.loginAt);
  const formatted = dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const fullRecord: AdminAuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...entry,
    loginFormatted: formatted,
  };

  db.adminAuditLogs.unshift(fullRecord);
  // Cap at 200 logs to prevent bloat
  if (db.adminAuditLogs.length > 200) {
    db.adminAuditLogs = db.adminAuditLogs.slice(0, 200);
  }

  await saveDb(db);
  return fullRecord;
}

export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  const db = await getDb();
  return db.adminAuditLogs || [];
}

// ==========================================
// Visitor Telemetry
// ==========================================
export async function recordVisitorTelemetry(
  data: Omit<VisitorTelemetry, 'visitCount' | 'firstSeenAt' | 'lastVisitedAt'>
): Promise<VisitorTelemetry> {
  const db = await getDb();
  const now = new Date().toISOString();
  const existingIndex = db.visitorTelemetry.findIndex((v) => v.visitorId === data.visitorId);

  if (existingIndex >= 0) {
    const existing = db.visitorTelemetry[existingIndex];
    const updated: VisitorTelemetry = {
      ...existing,
      ...data,
      visitCount: existing.visitCount + 1,
      lastVisitedAt: now,
    };
    db.visitorTelemetry[existingIndex] = updated;
    await saveDb(db);
    return updated;
  } else {
    const newVisitor: VisitorTelemetry = {
      ...data,
      visitCount: 1,
      firstSeenAt: now,
      lastVisitedAt: now,
    };
    db.visitorTelemetry.unshift(newVisitor);
    if (db.visitorTelemetry.length > 500) {
      db.visitorTelemetry = db.visitorTelemetry.slice(0, 500);
    }
    await saveDb(db);
    return newVisitor;
  }
}

export async function getVisitorTelemetry(): Promise<VisitorTelemetry[]> {
  const db = await getDb();
  return db.visitorTelemetry || [];
}

// ==========================================
// Identified Leads
// ==========================================
export async function recordLeadSubmission(
  leadData: Omit<LeadSubmission, 'id' | 'timestamp' | 'visitCountAtSubmission'>
): Promise<LeadSubmission> {
  const db = await getDb();

  // Find visitor telemetry to stitch visit frequency
  const visitor = leadData.visitorId
    ? db.visitorTelemetry.find((v) => v.visitorId === leadData.visitorId)
    : undefined;

  const visitCount = visitor ? visitor.visitCount : 1;

  const record: LeadSubmission = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...leadData,
    timestamp: new Date().toISOString(),
    visitCountAtSubmission: visitCount,
    ipAddress: leadData.ipAddress || visitor?.ipAddress || '127.0.0.1',
    city: leadData.city || visitor?.city || 'Localhost Dev',
    region: leadData.region || visitor?.region || 'Sindh',
    country: leadData.country || visitor?.country || 'Pakistan',
  };

  db.leadSubmissions.unshift(record);
  await saveDb(db);
  return record;
}

export async function getLeadSubmissions(): Promise<LeadSubmission[]> {
  const db = await getDb();
  return db.leadSubmissions || [];
}
