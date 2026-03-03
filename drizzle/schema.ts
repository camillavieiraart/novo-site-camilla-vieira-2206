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
  audioUrl: text("audioUrl"), // CDN URL for audio narration
  videoUrl: text("videoUrl"), // CDN URL for video narration
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

// ─── NEWSLETTER SUBSCRIBERS ───────────────────────────────────────────────────────
// Preferências de conteúdo informadas no cadastro para personalização e redução de unsubscribes
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 200 }),
  isActive: boolean("isActive").default(true),
  source: varchar("source", { length: 100 }).default("website"), // website, popup, footer
  // Frequência informada no cadastro (reduz unsubscribes - 69% cancelam por excesso)
  frequencyPreference: mysqlEnum("frequencyPreference", ["semanal", "quinzenal"]).default("semanal"),
  // Preferências de conteúdo (3 camadas do público + alerta de blog)
  // JSON array com valores: "todos", "ensaios", "arte", "mentoria", "blog_alert"
  // "todos" = recebe tudo; "blog_alert" = notificado a cada publicação
  contentPreferences: text("contentPreferences"), // JSON array: ["todos"] | ["ensaios","arte","mentoria","blog_alert"]
  // Token único para unsubscribe sem login
  unsubscribeToken: varchar("unsubscribeToken", { length: 64 }),
  // Rastreamento de engajamento por assinante
  totalEmailsReceived: int("totalEmailsReceived").default(0),
  totalOpens: int("totalOpens").default(0),
  totalClicks: int("totalClicks").default(0),
  lastOpenedAt: timestamp("lastOpenedAt"),
  lastClickedAt: timestamp("lastClickedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── NEWSLETTERS SENT (Campanhas enviadas) ────────────────────────────────────
export const newslettersSent = mysqlTable("newsletters_sent", {
  id: int("id").autoincrement().primaryKey(),
  subject: varchar("subject", { length: 300 }).notNull(),
  previewText: varchar("previewText", { length: 200 }), // Texto de preview no cliente de email
  topic: text("topic"), // Tópico de pesquisa usado para gerar o conteúdo
  htmlContent: text("htmlContent").notNull(), // HTML completo do email
  recipientCount: int("recipientCount").default(0),
  status: varchar("status", { length: 50 }).default("sent"), // sent, failed, draft
  resendBatchId: varchar("resendBatchId", { length: 200 }),
  // Agendamento rotativo: terça, quarta ou quinta entre 9h-15h (pico 11h-14h)
  scheduledDay: varchar("scheduledDay", { length: 20 }), // terca, quarta, quinta
  scheduledHour: int("scheduledHour"), // 9-15
  // Analytics de engajamento
  openCount: int("openCount").default(0),
  clickCount: int("clickCount").default(0),
  unsubscribeCount: int("unsubscribeCount").default(0),
  openRate: decimal("openRate", { precision: 5, scale: 2 }).default("0.00"),
  clickRate: decimal("clickRate", { precision: 5, scale: 2 }).default("0.00"),
  unsubscribeRate: decimal("unsubscribeRate", { precision: 5, scale: 2 }).default("0.00"),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── EMAIL EVENTS (Abertura e cliques individuais para analytics granular) ────
export const emailEvents = mysqlTable("email_events", {
  id: int("id").autoincrement().primaryKey(),
  newsletterId: int("newsletterId").notNull(),
  subscriberEmail: varchar("subscriberEmail", { length: 320 }).notNull(),
  eventType: varchar("eventType", { length: 50 }).notNull(), // open, click, unsubscribe
  linkUrl: text("linkUrl"), // URL clicada (para eventos de click)
  userAgent: text("userAgent"), // Dispositivo/cliente de email
  ipAddress: varchar("ipAddress", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
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
export type NewsletterSent = typeof newslettersSent.$inferSelect;
export type EmailEvent = typeof emailEvents.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
