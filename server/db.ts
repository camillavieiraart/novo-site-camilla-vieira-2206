import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, artworks, blogPosts, bookings, ceramics, contactMessages,
  homeSections, mentorships, newsletterSubscribers, portfolioCategories, portfolioImages,
  portfolioShoots, siteSettings, specialProjects, testimonials, users, videos,
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
export async function getPortfolioCategoryBySlug(slug: string) {
  const db = await getDb(); if (!db) return undefined;
  const r = await db.select().from(portfolioCategories).where(eq(portfolioCategories.slug, slug)).limit(1);
  return r[0];
}
export async function getShootsByCategorySlug(slug: string) {
  const db = await getDb(); if (!db) return [];
  const cat = await getPortfolioCategoryBySlug(slug);
  if (!cat) return [];
  return db.select().from(portfolioShoots)
    .where(and(eq(portfolioShoots.categoryId, cat.id), eq(portfolioShoots.isActive, true)))
    .orderBy(asc(portfolioShoots.order));
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

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export async function getPublishedTestimonials() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(testimonials)
    .where(eq(testimonials.isPublished, true))
    .orderBy(asc(testimonials.order), desc(testimonials.createdAt));
}
export async function getAllTestimonials() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(testimonials).orderBy(asc(testimonials.order), desc(testimonials.createdAt));
}
export async function upsertTestimonial(data: typeof testimonials.$inferInsert & { id?: number }) {
  const db = await getDb(); if (!db) return;
  if (data.id) {
    const { id, ...rest } = data;
    await db.update(testimonials).set(rest).where(eq(testimonials.id, id));
  } else {
    await db.insert(testimonials).values(data);
  }
}
export async function deleteTestimonial(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(testimonials).where(eq(testimonials.id, id));
}
export async function getPendingTestimonials() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(testimonials)
    .where(eq(testimonials.isPending, true))
    .orderBy(desc(testimonials.createdAt));
}
export async function submitTestimonialForm(data: {
  name: string; role?: string; sessionType?: string; email?: string; text: string; rating?: number;
}) {
  const db = await getDb(); if (!db) return;
  await db.insert(testimonials).values({
    name: data.name,
    role: data.role ?? null,
    sessionType: data.sessionType ?? null,
    email: data.email ?? null,
    text: data.text,
    rating: data.rating ?? 5,
    isPending: true,
    isPublished: false,
    sourceType: "form",
  });
}
export async function approveTestimonial(id: number) {
  const db = await getDb(); if (!db) return;
  await db.update(testimonials)
    .set({ isPending: false, isPublished: true, updatedAt: new Date() })
    .where(eq(testimonials.id, id));
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
export async function subscribeNewsletter(email: string, name?: string, source?: string) {
  const db = await getDb(); if (!db) return { success: false, alreadyExists: false };
  try {
    await db.insert(newsletterSubscribers).values({ email, name: name ?? null, source: source ?? "website", isActive: true });
    return { success: true, alreadyExists: false };
  } catch (e: any) {
    if (e?.code === "ER_DUP_ENTRY") return { success: true, alreadyExists: true };
    throw e;
  }
}
export async function getAllNewsletterSubscribers() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
}
export async function unsubscribeNewsletter(email: string) {
  const db = await getDb(); if (!db) return;
  await db.update(newsletterSubscribers).set({ isActive: false }).where(eq(newsletterSubscribers.email, email));
}
export async function deleteNewsletterSubscriber(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
}

// ─── BLOG POSTS ───────────────────────────────────────────────────────────────
export async function getPublishedBlogPosts(limit = 20, offset = 0, language?: string) {
  const db = await getDb(); if (!db) return [];
  const conditions = language
    ? and(eq(blogPosts.isPublished, true), eq(blogPosts.language, language))
    : eq(blogPosts.isPublished, true);
  return db.select().from(blogPosts)
    .where(conditions)
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit).offset(offset);
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb(); if (!db) return null;
  const rows = await db.select().from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllBlogPosts() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getBlogPostById(id: number) {
  const db = await getDb(); if (!db) return null;
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function upsertBlogPost(data: typeof blogPosts.$inferInsert & { id?: number }) {
  const db = await getDb(); if (!db) return null;
  if (data.id) {
    const { id, ...rest } = data;
    await db.update(blogPosts).set({ ...rest, updatedAt: new Date() }).where(eq(blogPosts.id, id));
    return id;
  } else {
    const result = await db.insert(blogPosts).values(data);
    return (result as any)[0]?.insertId ?? null;
  }
}

export async function deleteBlogPost(id: number) {
  const db = await getDb(); if (!db) return;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function getBlogSitemapData() {
  const db = await getDb(); if (!db) return [];
  return db.select({
    slug: blogPosts.slug,
    updatedAt: blogPosts.updatedAt,
    publishedAt: blogPosts.publishedAt,
  }).from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getRssFeedData(limit: number = 20) {
  const db = await getDb(); if (!db) return [];
  return db.select({
    slug: blogPosts.slug,
    title: blogPosts.title,
    excerpt: blogPosts.excerpt,
    author: blogPosts.author,
    category: blogPosts.category,
    coverImageUrl: blogPosts.coverImageUrl,
    publishedAt: blogPosts.publishedAt,
    updatedAt: blogPosts.updatedAt,
  }).from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
}

// ─── NEWSLETTER CAMPAIGNS ─────────────────────────────────────────────────────
import { newslettersSent } from "../drizzle/schema";

export async function getNewsletterCampaigns() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(newslettersSent).orderBy(desc(newslettersSent.sentAt)).limit(50);
}
export async function getNewsletterCampaignById(id: number) {
  const db = await getDb(); if (!db) return null;
  const rows = await db.select().from(newslettersSent).where(eq(newslettersSent.id, id)).limit(1);
  return rows[0] ?? null;
}
export async function updateNewsletterSubscriber(id: number, data: Partial<{
  isActive: boolean;
  frequencyPreference: "semanal" | "quinzenal";
  contentPreferences: string;
}>) {
  const db = await getDb(); if (!db) return;
  await db.update(newsletterSubscribers).set({ ...data, updatedAt: new Date() }).where(eq(newsletterSubscribers.id, id));
}
export async function subscribeNewsletterWithPreferences(
  email: string,
  name?: string,
  source?: string,
  frequencyPreference?: "semanal" | "quinzenal",
  contentPreferences?: string[]
) {
  const db = await getDb(); if (!db) return { success: false, alreadyExists: false };
  const prefs = JSON.stringify(contentPreferences?.length ? contentPreferences : ["todos"]);
  try {
    const { randomBytes } = await import("crypto");
    const token = randomBytes(32).toString("hex");
    await db.insert(newsletterSubscribers).values({
      email,
      name: name ?? null,
      source: source ?? "website",
      isActive: true,
      frequencyPreference: frequencyPreference ?? "semanal",
      contentPreferences: prefs,
      unsubscribeToken: token,
    });
    return { success: true, alreadyExists: false };
  } catch (e: any) {
    if (e?.code === "ER_DUP_ENTRY") {
      await db.update(newsletterSubscribers).set({
        frequencyPreference: frequencyPreference ?? "semanal",
        contentPreferences: prefs,
        isActive: true,
        updatedAt: new Date(),
      }).where(eq(newsletterSubscribers.email, email));
      return { success: true, alreadyExists: true };
    }
    throw e;
  }
}
export async function getBlogAlertSubscribers() {
  const db = await getDb(); if (!db) return [];
  const all = await db.select({
    email: newsletterSubscribers.email,
    name: newsletterSubscribers.name,
    unsubscribeToken: newsletterSubscribers.unsubscribeToken,
    contentPreferences: newsletterSubscribers.contentPreferences,
  }).from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true));
  return all.filter(s => {
    try {
      const prefs: string[] = JSON.parse(s.contentPreferences ?? '["todos"]');
      return prefs.includes("todos") || prefs.includes("blog_alert");
    } catch { return false; }
  });
}
