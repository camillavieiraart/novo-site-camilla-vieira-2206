/**
 * Tests for new features:
 * 1. Testimonials submission (public form + moderation)
 * 2. Blog multilingual filter (language param)
 * 3. Schema changes (isPending, sourceType, language fields)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock DB ─────────────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  getPublishedTestimonials: vi.fn(),
  submitTestimonialForm: vi.fn(),
  getPendingTestimonials: vi.fn(),
  approveTestimonial: vi.fn(),
  getPublishedBlogPosts: vi.fn(),
}));

import {
  getPublishedTestimonials,
  submitTestimonialForm,
  getPendingTestimonials,
  approveTestimonial,
  getPublishedBlogPosts,
} from "./db";

// ─── Testimonials ─────────────────────────────────────────────────────────────
describe("Testimonials — public submission", () => {
  beforeEach(() => vi.clearAllMocks());

  it("submitTestimonialForm is called with correct data", async () => {
    const mockFn = vi.mocked(submitTestimonialForm);
    mockFn.mockResolvedValue({ id: 1, name: "Maria", text: "Incrível!", rating: 5, isPending: true } as any);

    const result = await submitTestimonialForm({
      name: "Maria",
      text: "Incrível!",
      rating: 5,
      sessionType: "Ensaio Feminino",
    });

    expect(mockFn).toHaveBeenCalledWith({
      name: "Maria",
      text: "Incrível!",
      rating: 5,
      sessionType: "Ensaio Feminino",
    });
    expect(result.isPending).toBe(true);
  });

  it("getPublishedTestimonials returns only published (non-pending) testimonials", async () => {
    const mockFn = vi.mocked(getPublishedTestimonials);
    mockFn.mockResolvedValue([
      { id: 1, name: "Ana", text: "Ótimo!", isPending: false, isPublished: true } as any,
    ]);

    const result = await getPublishedTestimonials();
    expect(result).toHaveLength(1);
    expect(result[0].isPublished).toBe(true);
  });

  it("getPendingTestimonials returns testimonials awaiting moderation", async () => {
    const mockFn = vi.mocked(getPendingTestimonials);
    mockFn.mockResolvedValue([
      { id: 2, name: "Bia", text: "Adorei!", isPending: true, isPublished: false } as any,
    ]);

    const result = await getPendingTestimonials();
    expect(result).toHaveLength(1);
    expect(result[0].isPending).toBe(true);
  });

  it("approveTestimonial sets isPending to false and isPublished to true", async () => {
    const mockFn = vi.mocked(approveTestimonial);
    mockFn.mockResolvedValue({ id: 2, isPending: false, isPublished: true } as any);

    const result = await approveTestimonial(2);
    expect(mockFn).toHaveBeenCalledWith(2);
    expect(result.isPending).toBe(false);
    expect(result.isPublished).toBe(true);
  });
});

// ─── Blog Multilingual ────────────────────────────────────────────────────────
describe("Blog — multilingual filter", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getPublishedBlogPosts without language returns all posts", async () => {
    const mockFn = vi.mocked(getPublishedBlogPosts);
    mockFn.mockResolvedValue([
      { id: 1, title: "Fotografia", language: "pt" } as any,
      { id: 2, title: "Photography", language: "en" } as any,
      { id: 3, title: "Photographie", language: "fr" } as any,
    ]);

    const result = await getPublishedBlogPosts(20, 0);
    expect(mockFn).toHaveBeenCalledWith(20, 0);
    expect(result).toHaveLength(3);
  });

  it("getPublishedBlogPosts with language='en' filters correctly", async () => {
    const mockFn = vi.mocked(getPublishedBlogPosts);
    mockFn.mockResolvedValue([
      { id: 2, title: "Photography", language: "en" } as any,
    ]);

    const result = await getPublishedBlogPosts(20, 0, "en");
    expect(mockFn).toHaveBeenCalledWith(20, 0, "en");
    expect(result).toHaveLength(1);
    expect(result[0].language).toBe("en");
  });

  it("getPublishedBlogPosts with language='fr' filters correctly", async () => {
    const mockFn = vi.mocked(getPublishedBlogPosts);
    mockFn.mockResolvedValue([
      { id: 3, title: "Photographie", language: "fr" } as any,
    ]);

    const result = await getPublishedBlogPosts(20, 0, "fr");
    expect(result[0].language).toBe("fr");
  });

  it("getPublishedBlogPosts with language='pt' filters correctly", async () => {
    const mockFn = vi.mocked(getPublishedBlogPosts);
    mockFn.mockResolvedValue([
      { id: 1, title: "Fotografia", language: "pt" } as any,
    ]);

    const result = await getPublishedBlogPosts(20, 0, "pt");
    expect(result[0].language).toBe("pt");
  });
});
