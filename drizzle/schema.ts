import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
} from "drizzle-orm/mysql-core";

// ─── USERS ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── HOME SECTIONS ────────────────────────────────────────────────────────────
export const homeSections = mysqlTable("home_sections", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  buttonText: varchar("buttonText", { length: 100 }),
  buttonLink: varchar("buttonLink", { length: 255 }),
  imageUrl: text("imageUrl"),
  videoUrl: text("videoUrl"),
  bgColor: varchar("bgColor", { length: 50 }),
  textColor: varchar("textColor", { length: 50 }),
  order: int("order").default(0),
  isActive: boolean("isActive").default(true),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── PORTFOLIO CATEGORIES ─────────────────────────────────────────────────────
export const portfolioCategories = mysqlTable("portfolio_categories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  coverImageUrl: text("coverImageUrl"),
  type: mysqlEnum("type", ["ensaio", "fotografia_autoral", "ceramica", "projeto_especial"]).default("ensaio"),
  order: int("order").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── PORTFOLIO SHOOTS ─────────────────────────────────────────────────────────
export const portfolioShoots = mysqlTable("portfolio_shoots", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  coverImageUrl: text("coverImageUrl"),
  date: varchar("date", { length: 50 }),
  location: varchar("location", { length: 200 }),
  order: int("order").default(0),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── PORTFOLIO IMAGES ─────────────────────────────────────────────────────────
export const portfolioImages = mysqlTable("portfolio_images", {
  id: int("id").autoincrement().primaryKey(),
  shootId: int("shootId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  caption: text("caption"),
  order: int("order").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── ARTWORKS (Obras de Arte) ─────────────────────────────────────────────────
export const artworks = mysqlTable("artworks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  series: varchar("series", { length: 150 }),
  year: varchar("year", { length: 10 }),
  technique: text("technique"),
  dimensions: varchar("dimensions", { length: 100 }),
  description: text("description"),
  poeticText: text("poeticText"),
  imageUrl: text("imageUrl").notNull(),
  additionalImages: text("additionalImages"), // JSON array
  price: decimal("price", { precision: 10, scale: 2 }),
  priceDisplay: varchar("priceDisplay", { length: 50 }),
  isAvailable: boolean("isAvailable").default(true),
  isFeatured: boolean("isFeatured").default(false),
  order: int("order").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── CERAMICS ─────────────────────────────────────────────────────────────────
export const ceramics = mysqlTable("ceramics", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  technique: text("technique"),
  dimensions: varchar("dimensions", { length: 100 }),
  imageUrl: text("imageUrl").notNull(),
  additionalImages: text("additionalImages"), // JSON array
  price: decimal("price", { precision: 10, scale: 2 }),
  priceDisplay: varchar("priceDisplay", { length: 50 }),
  isAvailable: boolean("isAvailable").default(true),
  isFeatured: boolean("isFeatured").default(false),
  order: int("order").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── SPECIAL PROJECTS ─────────────────────────────────────────────────────────
export const specialProjects = mysqlTable("special_projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  type: mysqlEnum("type", ["colaboracao", "exposicao", "trabalho_unico", "outro"]).default("outro"),
  description: text("description"),
  coverImageUrl: text("coverImageUrl"),
  images: text("images"), // JSON array
  date: varchar("date", { length: 50 }),
  location: varchar("location", { length: 200 }),
  collaborators: text("collaborators"),
  order: int("order").default(0),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── VIDEOS ───────────────────────────────────────────────────────────────────
export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  videoUrl: text("videoUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  type: mysqlEnum("type", ["manifesto", "bastidores", "processo", "depoimento", "outro"]).default("outro"),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── MENTORSHIPS ──────────────────────────────────────────────────────────────
export const mentorships = mysqlTable("mentorships", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  details: text("details"),
  duration: varchar("duration", { length: 100 }),
  modality: varchar("modality", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  priceDisplay: varchar("priceDisplay", { length: 50 }),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── BOOKINGS (Agendamentos) ──────────────────────────────────────────────────
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  mentorshipId: int("mentorshipId"),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 200 }),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 200 }), // ex: "Noiva", "Mãe", "Artista"
  avatarUrl: text("avatarUrl"),
  text: text("text").notNull(),
  rating: int("rating").default(5), // 1-5
  isPublished: boolean("isPublished").default(true),
  isFeatured: boolean("isFeatured").default(false),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── NEWSLETTER SUBSCRIBERS ───────────────────────────────────────────────────
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 200 }),
  isActive: boolean("isActive").default(true),
  source: varchar("source", { length: 100 }).default("website"), // website, popup, footer
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── BLOG POSTS ─────────────────────────────────────────────────────────────
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  // Content
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  excerpt: text("excerpt"), // Short summary shown in listing
  content: text("content").notNull(), // Full HTML/Markdown content
  coverImageUrl: text("coverImageUrl"), // CDN URL of the cover image
  coverImageAlt: varchar("coverImageAlt", { length: 300 }), // Alt text for SEO
  // Taxonomy
  category: varchar("category", { length: 100 }).default("fotografia"), // editorial category
  tags: text("tags"), // JSON array of tags
  // SEO / GEO
  metaTitle: varchar("metaTitle", { length: 70 }), // Up to 60 chars ideal
  metaDescription: varchar("metaDescription", { length: 200 }), // Up to 155 chars ideal
  canonicalUrl: text("canonicalUrl"),
  ogImageUrl: text("ogImageUrl"), // Open Graph image (can differ from cover)
  keywords: text("keywords"), // Comma-separated keywords
  schemaJson: text("schemaJson"), // JSON-LD structured data (Article/BlogPosting)
  // Authoring
  author: varchar("author", { length: 200 }).default("Camilla Vieira"),
  readingTimeMinutes: int("readingTimeMinutes").default(5),
  wordCount: int("wordCount").default(0),
  // Status
  isPublished: boolean("isPublished").default(false),
  publishedAt: timestamp("publishedAt"),
  // Source tracking
  isAutoGenerated: boolean("isAutoGenerated").default(false), // true = generated by agent
  agentTrendTopic: text("agentTrendTopic"), // The trend topic the agent used
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── TYPES ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type HomeSection = typeof homeSections.$inferSelect;
export type PortfolioCategory = typeof portfolioCategories.$inferSelect;
export type PortfolioShoot = typeof portfolioShoots.$inferSelect;
export type PortfolioImage = typeof portfolioImages.$inferSelect;
export type Artwork = typeof artworks.$inferSelect;
export type Ceramic = typeof ceramics.$inferSelect;
export type SpecialProject = typeof specialProjects.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Mentorship = typeof mentorships.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
