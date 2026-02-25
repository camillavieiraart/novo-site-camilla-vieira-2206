import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, artworks, bookings, ceramics, contactMessages,
  homeSections, mentorships, portfolioCategories, portfolioImages,
  portfolioShoots, siteSettings, specialProjects, users, videos,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (e) { console.warn("[Database] Failed to connect:", e); _db = null; }
  }
  return _db;
}

// ─── USERS ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    for (const f of textFields) {
      if (user[f] !== undefined) { values[f] = user[f] ?? null; updateSet[f] = user[f] ?? null; }
    }
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (e) { console.error("[Database] Failed to upsert user:", e); throw e; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const r = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return r[0];
}

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────
export async function getSiteSettings() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(siteSettings);
}
export async function upsertSiteSetting(key: string, value: string) {
  const db = await getDb(); if (!db) return;
  await db.insert(siteSettings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

// ─── HOME SECTIONS ────────────────────────────────────────────────────────────
export async function getHomeSections() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(homeSections).where(eq(homeSections.isActive, true)).orderBy(asc(homeSections.order));
}
export async function getAllHomeSections() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(homeSections).orderBy(asc(homeSections.order));
}
export async function upsertHomeSection(data: typeof homeSections.$inferInsert) {
  const db = await getDb(); if (!db) return;
  if (data.id) {
    await db.update(homeSections).set({ ...data, updatedAt: new Date() }).where(eq(homeSections.id, data.id));
  } else {
    await db.insert(homeSections).values(data);
  }
}
export async function deleteHomeSection(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(homeSections).where(eq(homeSections.id, id));
}

// ─── PORTFOLIO CATEGORIES ─────────────────────────────────────────────────────
export async function getPortfolioCategories(type?: string) {
  const db = await getDb(); if (!db) return [];
  const q = db.select().from(portfolioCategories).where(eq(portfolioCategories.isActive, true));
  return q.orderBy(asc(portfolioCategories.order));
}
export async function getAllPortfolioCategories() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(portfolioCategories).orderBy(asc(portfolioCategories.order));
}
export async function upsertPortfolioCategory(data: typeof portfolioCategories.$inferInsert) {
  const db = await getDb(); if (!db) return;
  if (data.id) {
    await db.update(portfolioCategories).set({ ...data, updatedAt: new Date() }).where(eq(portfolioCategories.id, data.id));
  } else {
    await db.insert(portfolioCategories).values(data);
  }
}
export async function deletePortfolioCategory(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(portfolioCategories).where(eq(portfolioCategories.id, id));
}

// ─── PORTFOLIO SHOOTS ─────────────────────────────────────────────────────────
export async function getShootsByCategory(categoryId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(portfolioShoots)
    .where(and(eq(portfolioShoots.categoryId, categoryId), eq(portfolioShoots.isActive, true)))
    .orderBy(asc(portfolioShoots.order));
}
export async function getShootBySlug(slug: string) {
  const db = await getDb(); if (!db) return undefined;
  const r = await db.select().from(portfolioShoots).where(eq(portfolioShoots.slug, slug)).limit(1);
  return r[0];
}
export async function getAllShoots() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(portfolioShoots).orderBy(desc(portfolioShoots.createdAt));
}
export async function upsertShoot(data: typeof portfolioShoots.$inferInsert) {
  const db = await getDb(); if (!db) return;
  if (data.id) {
    await db.update(portfolioShoots).set({ ...data, updatedAt: new Date() }).where(eq(portfolioShoots.id, data.id));
  } else {
    await db.insert(portfolioShoots).values(data);
  }
}
export async function deleteShoot(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(portfolioShoots).where(eq(portfolioShoots.id, id));
}

// ─── PORTFOLIO IMAGES ─────────────────────────────────────────────────────────
export async function getImagesByShoot(shootId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(portfolioImages)
    .where(and(eq(portfolioImages.shootId, shootId), eq(portfolioImages.isActive, true)))
    .orderBy(asc(portfolioImages.order));
}
export async function addPortfolioImage(data: typeof portfolioImages.$inferInsert) {
  const db = await getDb(); if (!db) return;
  await db.insert(portfolioImages).values(data);
}
export async function deletePortfolioImage(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(portfolioImages).where(eq(portfolioImages.id, id));
}

// ─── ARTWORKS ─────────────────────────────────────────────────────────────────
export async function getArtworks(series?: string) {
  const db = await getDb(); if (!db) return [];
  const base = db.select().from(artworks).where(eq(artworks.isActive, true));
  return base.orderBy(asc(artworks.order));
}
export async function getAllArtworks() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(artworks).orderBy(asc(artworks.order));
}
export async function getArtworkBySlug(slug: string) {
  const db = await getDb(); if (!db) return undefined;
  const r = await db.select().from(artworks).where(eq(artworks.slug, slug)).limit(1);
  return r[0];
}
export async function upsertArtwork(data: typeof artworks.$inferInsert) {
  const db = await getDb(); if (!db) return;
  if (data.id) {
    await db.update(artworks).set({ ...data, updatedAt: new Date() }).where(eq(artworks.id, data.id));
  } else {
    await db.insert(artworks).values(data);
  }
}
export async function deleteArtwork(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(artworks).where(eq(artworks.id, id));
}

// ─── CERAMICS ─────────────────────────────────────────────────────────────────
export async function getCeramics() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(ceramics).where(eq(ceramics.isActive, true)).orderBy(asc(ceramics.order));
}
export async function getAllCeramics() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(ceramics).orderBy(asc(ceramics.order));
}
export async function upsertCeramic(data: typeof ceramics.$inferInsert) {
  const db = await getDb(); if (!db) return;
  if (data.id) {
    await db.update(ceramics).set({ ...data, updatedAt: new Date() }).where(eq(ceramics.id, data.id));
  } else {
    await db.insert(ceramics).values(data);
  }
}
export async function deleteCeramic(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(ceramics).where(eq(ceramics.id, id));
}

// ─── SPECIAL PROJECTS ─────────────────────────────────────────────────────────
export async function getSpecialProjects() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(specialProjects).where(eq(specialProjects.isActive, true)).orderBy(asc(specialProjects.order));
}
export async function getAllSpecialProjects() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(specialProjects).orderBy(asc(specialProjects.order));
}
export async function upsertSpecialProject(data: typeof specialProjects.$inferInsert) {
  const db = await getDb(); if (!db) return;
  if (data.id) {
    await db.update(specialProjects).set({ ...data, updatedAt: new Date() }).where(eq(specialProjects.id, data.id));
  } else {
    await db.insert(specialProjects).values(data);
  }
}
export async function deleteSpecialProject(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(specialProjects).where(eq(specialProjects.id, id));
}

// ─── VIDEOS ───────────────────────────────────────────────────────────────────
export async function getVideos(type?: string) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(videos).where(eq(videos.isActive, true)).orderBy(asc(videos.order));
}
export async function getAllVideos() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(videos).orderBy(asc(videos.order));
}
export async function upsertVideo(data: typeof videos.$inferInsert) {
  const db = await getDb(); if (!db) return;
  if (data.id) {
    await db.update(videos).set({ ...data, updatedAt: new Date() }).where(eq(videos.id, data.id));
  } else {
    await db.insert(videos).values(data);
  }
}
export async function deleteVideo(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(videos).where(eq(videos.id, id));
}

// ─── MENTORSHIPS ──────────────────────────────────────────────────────────────
export async function getMentorships() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(mentorships).where(eq(mentorships.isActive, true)).orderBy(asc(mentorships.order));
}
export async function getAllMentorships() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(mentorships).orderBy(asc(mentorships.order));
}
export async function upsertMentorship(data: typeof mentorships.$inferInsert) {
  const db = await getDb(); if (!db) return;
  if (data.id) {
    await db.update(mentorships).set({ ...data, updatedAt: new Date() }).where(eq(mentorships.id, data.id));
  } else {
    await db.insert(mentorships).values(data);
  }
}
export async function deleteMentorship(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(mentorships).where(eq(mentorships.id, id));
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
export async function createBooking(data: typeof bookings.$inferInsert) {
  const db = await getDb(); if (!db) return;
  await db.insert(bookings).values(data);
}
export async function getAllBookings() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
export async function createContactMessage(data: typeof contactMessages.$inferInsert) {
  const db = await getDb(); if (!db) return;
  await db.insert(contactMessages).values(data);
}
export async function getAllContactMessages() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}
export async function markMessageRead(id: number) {
  const db = await getDb(); if (!db) return;
  await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
}
