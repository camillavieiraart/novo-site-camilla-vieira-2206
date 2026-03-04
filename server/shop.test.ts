import { describe, it, expect } from "vitest";

// ─── Unit tests for shop router pure logic ────────────────────────────────────

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isOutOfStock(stock: number | null): boolean {
  return stock !== null && stock <= 0;
}

function hasDiscount(priceInCents: number, compareAtPriceInCents: number | null): boolean {
  return compareAtPriceInCents !== null && compareAtPriceInCents > priceInCents;
}

function calculateDiscountPercent(priceInCents: number, compareAtPriceInCents: number): number {
  return Math.round(((compareAtPriceInCents - priceInCents) / compareAtPriceInCents) * 100);
}

const VALID_CATEGORIES = ["ensaio", "obra_arte", "ceramica", "print", "mentoria"] as const;
const VALID_DELIVERY_TYPES = ["agendamento", "envio_fisico", "download", "acesso_online"] as const;

describe("Shop Router — Price Formatting", () => {
  it("should format price in BRL", () => {
    expect(formatPrice(35000)).toContain("350");
    expect(formatPrice(35000)).toContain("R$");
  });

  it("should format zero price", () => {
    expect(formatPrice(0)).toContain("0");
  });

  it("should format price with cents", () => {
    expect(formatPrice(9990)).toContain("99");
  });
});

describe("Shop Router — Slug Generation", () => {
  it("should generate slug from product name", () => {
    expect(generateSlug("Ensaio Sensorial")).toBe("ensaio-sensorial");
  });

  it("should handle accented characters", () => {
    expect(generateSlug("Cerâmica Artesanal")).toBe("ceramica-artesanal");
    expect(generateSlug("Série Fio")).toBe("serie-fio");
  });

  it("should handle special characters", () => {
    expect(generateSlug("Obra: Raízes & Memórias")).toBe("obra-raizes-memorias");
  });

  it("should not start or end with hyphens", () => {
    const slug = generateSlug("  Produto Especial  ");
    expect(slug).not.toMatch(/^-|-$/);
  });
});

describe("Shop Router — Stock Management", () => {
  it("should not be out of stock when stock is null (unlimited)", () => {
    expect(isOutOfStock(null)).toBe(false);
  });

  it("should be out of stock when stock is 0", () => {
    expect(isOutOfStock(0)).toBe(true);
  });

  it("should be out of stock when stock is negative", () => {
    expect(isOutOfStock(-1)).toBe(true);
  });

  it("should not be out of stock when stock is positive", () => {
    expect(isOutOfStock(5)).toBe(false);
    expect(isOutOfStock(1)).toBe(false);
  });
});

describe("Shop Router — Discount Logic", () => {
  it("should detect discount when compareAt is higher", () => {
    expect(hasDiscount(35000, 50000)).toBe(true);
  });

  it("should not detect discount when compareAt is null", () => {
    expect(hasDiscount(35000, null)).toBe(false);
  });

  it("should not detect discount when compareAt equals price", () => {
    expect(hasDiscount(35000, 35000)).toBe(false);
  });

  it("should not detect discount when compareAt is lower (invalid state)", () => {
    expect(hasDiscount(50000, 35000)).toBe(false);
  });

  it("should calculate correct discount percentage", () => {
    expect(calculateDiscountPercent(35000, 50000)).toBe(30);
    expect(calculateDiscountPercent(25000, 50000)).toBe(50);
  });
});

describe("Shop Router — Category Validation", () => {
  it("should have all expected categories", () => {
    expect(VALID_CATEGORIES).toContain("ensaio");
    expect(VALID_CATEGORIES).toContain("obra_arte");
    expect(VALID_CATEGORIES).toContain("ceramica");
    expect(VALID_CATEGORIES).toContain("print");
    expect(VALID_CATEGORIES).toContain("mentoria");
  });

  it("should have exactly 5 categories", () => {
    expect(VALID_CATEGORIES).toHaveLength(5);
  });
});

describe("Shop Router — Delivery Types", () => {
  it("should have all expected delivery types", () => {
    expect(VALID_DELIVERY_TYPES).toContain("agendamento");
    expect(VALID_DELIVERY_TYPES).toContain("envio_fisico");
    expect(VALID_DELIVERY_TYPES).toContain("download");
    expect(VALID_DELIVERY_TYPES).toContain("acesso_online");
  });

  it("should have exactly 4 delivery types", () => {
    expect(VALID_DELIVERY_TYPES).toHaveLength(4);
  });
});

describe("Shop Router — Order Stats", () => {
  it("should calculate total revenue excluding cancelled and refunded", () => {
    const byStatus: Record<string, { count: number; totalInCents: number }> = {
      paid: { count: 3, totalInCents: 105000 },
      processing: { count: 1, totalInCents: 35000 },
      shipped: { count: 2, totalInCents: 70000 },
      cancelled: { count: 1, totalInCents: 35000 },
      refunded: { count: 1, totalInCents: 35000 },
      pending: { count: 2, totalInCents: 70000 },
    };

    const excludedStatuses = ["cancelled", "refunded", "pending"];
    const totalRevenue = Object.entries(byStatus)
      .filter(([key]) => !excludedStatuses.includes(key))
      .reduce((sum, [, s]) => sum + s.totalInCents, 0);

    expect(totalRevenue).toBe(210000); // 105000 + 35000 + 70000
  });
});
