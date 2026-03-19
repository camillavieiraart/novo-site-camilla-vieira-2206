/**
 * Fine Art Prints — Unit Tests
 * Tests for price formatting, variant logic, and size/finish combinations.
 */
import { describe, it, expect } from "vitest";

// ─── Helpers (mirrors FineArtShop.tsx logic) ─────────────────────────────────
function formatBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

type Finish = "canvas" | "fine_art";

interface ArtworkVariant {
  id: number;
  artworkId: number;
  size: string;
  finish: Finish;
  priceInCents: number;
  isActive: boolean;
}

function findVariant(
  variants: ArtworkVariant[],
  size: string,
  finish: Finish
): ArtworkVariant | undefined {
  return variants.find((v) => v.size === size && v.finish === finish);
}

function getAvailableSizes(variants: ArtworkVariant[]): string[] {
  return Array.from(new Set(variants.map((v) => v.size)));
}

function getAvailableFinishes(variants: ArtworkVariant[], size: string): Finish[] {
  return Array.from(
    new Set(variants.filter((v) => v.size === size).map((v) => v.finish))
  );
}

// ─── Sample data (mirrors DB structure) ──────────────────────────────────────
const SAMPLE_VARIANTS: ArtworkVariant[] = [
  { id: 1, artworkId: 30001, size: "30x45 cm", finish: "fine_art", priceInCents: 97000, isActive: true },
  { id: 2, artworkId: 30001, size: "60x90 cm", finish: "fine_art", priceInCents: 197000, isActive: true },
  { id: 3, artworkId: 30001, size: "90x120 cm", finish: "fine_art", priceInCents: 347000, isActive: true },
  { id: 4, artworkId: 30001, size: "30x45 cm", finish: "canvas", priceInCents: 127000, isActive: true },
  { id: 5, artworkId: 30001, size: "60x90 cm", finish: "canvas", priceInCents: 247000, isActive: true },
];

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("Fine Art — Price Formatting", () => {
  it("should format 97000 cents as R$ 970,00", () => {
    expect(formatBRL(97000)).toContain("970");
    expect(formatBRL(97000)).toContain("R$");
  });

  it("should format 197000 cents as R$ 1.970,00", () => {
    expect(formatBRL(197000)).toContain("1.970");
  });

  it("should format 347000 cents as R$ 3.470,00", () => {
    expect(formatBRL(347000)).toContain("3.470");
  });

  it("should format 247000 cents as R$ 2.470,00", () => {
    expect(formatBRL(247000)).toContain("2.470");
  });
});

describe("Fine Art — Variant Selection", () => {
  it("should find the correct variant by size and finish", () => {
    const v = findVariant(SAMPLE_VARIANTS, "60x90 cm", "fine_art");
    expect(v).toBeDefined();
    expect(v?.priceInCents).toBe(197000);
    expect(v?.id).toBe(2);
  });

  it("should find canvas variant", () => {
    const v = findVariant(SAMPLE_VARIANTS, "60x90 cm", "canvas");
    expect(v).toBeDefined();
    expect(v?.priceInCents).toBe(247000);
  });

  it("should return undefined for non-existent combination", () => {
    const v = findVariant(SAMPLE_VARIANTS, "90x120 cm", "canvas");
    expect(v).toBeUndefined();
  });

  it("should return undefined for unknown size", () => {
    const v = findVariant(SAMPLE_VARIANTS, "120x180 cm", "fine_art");
    expect(v).toBeUndefined();
  });
});

describe("Fine Art — Available Sizes", () => {
  it("should return 3 unique sizes", () => {
    const sizes = getAvailableSizes(SAMPLE_VARIANTS);
    expect(sizes).toHaveLength(3);
    expect(sizes).toContain("30x45 cm");
    expect(sizes).toContain("60x90 cm");
    expect(sizes).toContain("90x120 cm");
  });

  it("should not duplicate sizes", () => {
    const sizes = getAvailableSizes(SAMPLE_VARIANTS);
    const unique = new Set(sizes);
    expect(unique.size).toBe(sizes.length);
  });
});

describe("Fine Art — Available Finishes per Size", () => {
  it("should return both finishes for 30x45 cm", () => {
    const finishes = getAvailableFinishes(SAMPLE_VARIANTS, "30x45 cm");
    expect(finishes).toContain("fine_art");
    expect(finishes).toContain("canvas");
    expect(finishes).toHaveLength(2);
  });

  it("should return only fine_art for 90x120 cm", () => {
    const finishes = getAvailableFinishes(SAMPLE_VARIANTS, "90x120 cm");
    expect(finishes).toContain("fine_art");
    expect(finishes).not.toContain("canvas");
    expect(finishes).toHaveLength(1);
  });

  it("should return empty array for unknown size", () => {
    const finishes = getAvailableFinishes(SAMPLE_VARIANTS, "200x300 cm");
    expect(finishes).toHaveLength(0);
  });
});

describe("Fine Art — Price Ordering", () => {
  it("should have fine_art cheaper than canvas for same size", () => {
    const fa = findVariant(SAMPLE_VARIANTS, "30x45 cm", "fine_art");
    const cv = findVariant(SAMPLE_VARIANTS, "30x45 cm", "canvas");
    expect(fa).toBeDefined();
    expect(cv).toBeDefined();
    expect(fa!.priceInCents).toBeLessThan(cv!.priceInCents);
  });

  it("should have larger sizes cost more (fine_art)", () => {
    const small = findVariant(SAMPLE_VARIANTS, "30x45 cm", "fine_art");
    const medium = findVariant(SAMPLE_VARIANTS, "60x90 cm", "fine_art");
    const large = findVariant(SAMPLE_VARIANTS, "90x120 cm", "fine_art");
    expect(small!.priceInCents).toBeLessThan(medium!.priceInCents);
    expect(medium!.priceInCents).toBeLessThan(large!.priceInCents);
  });
});
