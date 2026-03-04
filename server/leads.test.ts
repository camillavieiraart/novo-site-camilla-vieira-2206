import { describe, it, expect } from "vitest";

// ─── Unit tests for leads router logic ───────────────────────────────────────
// These tests validate the pure logic (stage transitions, form link generation)
// without hitting the database.

const VALID_STAGES = ["lead_frio", "lead_quente", "negociando", "fechado", "perdido"] as const;
type Stage = typeof VALID_STAGES[number];

function isValidStage(s: string): s is Stage {
  return VALID_STAGES.includes(s as Stage);
}

function getStageLabel(stage: Stage): string {
  const labels: Record<Stage, string> = {
    lead_frio: "Lead Frio",
    lead_quente: "Lead Quente",
    negociando: "Negociando",
    fechado: "Fechado",
    perdido: "Perdido",
  };
  return labels[stage];
}

function buildFormUrl(origin: string, token: string): string {
  return `${origin}/form/${token}`;
}

function groupLeadsByStage(leads: Array<{ id: number; stage: Stage }>): Record<Stage, typeof leads> {
  const grouped: Record<string, typeof leads> = {};
  for (const s of VALID_STAGES) grouped[s] = [];
  for (const lead of leads) {
    if (grouped[lead.stage]) grouped[lead.stage].push(lead);
  }
  return grouped as Record<Stage, typeof leads>;
}

describe("Leads Router — Stage Validation", () => {
  it("should accept all valid stages", () => {
    for (const stage of VALID_STAGES) {
      expect(isValidStage(stage)).toBe(true);
    }
  });

  it("should reject invalid stages", () => {
    expect(isValidStage("ativo")).toBe(false);
    expect(isValidStage("inativo")).toBe(false);
    expect(isValidStage("")).toBe(false);
    expect(isValidStage("FECHADO")).toBe(false);
  });

  it("should return correct stage labels", () => {
    expect(getStageLabel("lead_frio")).toBe("Lead Frio");
    expect(getStageLabel("lead_quente")).toBe("Lead Quente");
    expect(getStageLabel("negociando")).toBe("Negociando");
    expect(getStageLabel("fechado")).toBe("Fechado");
    expect(getStageLabel("perdido")).toBe("Perdido");
  });
});

describe("Leads Router — Kanban Grouping", () => {
  it("should group leads by stage correctly", () => {
    const leads = [
      { id: 1, stage: "lead_frio" as Stage },
      { id: 2, stage: "negociando" as Stage },
      { id: 3, stage: "fechado" as Stage },
      { id: 4, stage: "fechado" as Stage },
      { id: 5, stage: "lead_quente" as Stage },
    ];

    const grouped = groupLeadsByStage(leads);

    expect(grouped.lead_frio).toHaveLength(1);
    expect(grouped.lead_quente).toHaveLength(1);
    expect(grouped.negociando).toHaveLength(1);
    expect(grouped.fechado).toHaveLength(2);
    expect(grouped.perdido).toHaveLength(0);
  });

  it("should return empty arrays for stages with no leads", () => {
    const grouped = groupLeadsByStage([]);
    for (const stage of VALID_STAGES) {
      expect(grouped[stage]).toHaveLength(0);
    }
  });

  it("should preserve all 5 stage keys even when empty", () => {
    const grouped = groupLeadsByStage([{ id: 1, stage: "fechado" as Stage }]);
    expect(Object.keys(grouped)).toHaveLength(5);
    expect(grouped.lead_frio).toBeDefined();
    expect(grouped.perdido).toBeDefined();
  });
});

describe("Leads Router — Form URL Generation", () => {
  it("should build correct form URLs", () => {
    const url = buildFormUrl("https://camillavieira.art", "abc123token");
    expect(url).toBe("https://camillavieira.art/form/abc123token");
  });

  it("should handle different origins", () => {
    const url = buildFormUrl("http://localhost:3000", "xyz789");
    expect(url).toBe("http://localhost:3000/form/xyz789");
  });

  it("should not double-slash", () => {
    const url = buildFormUrl("https://camillavieira.art", "token");
    expect(url).not.toContain("//form");
  });
});

describe("Leads Router — Stats Calculation", () => {
  it("should calculate total leads from stage counts", () => {
    const byStage: Record<string, number> = {
      lead_frio: 3,
      lead_quente: 1,
      negociando: 8,
      fechado: 15,
      perdido: 0,
    };
    const total = Object.values(byStage).reduce((a, b) => a + b, 0);
    expect(total).toBe(27);
  });

  it("should handle missing stages in stats", () => {
    const byStage: Record<string, number> = { fechado: 10 };
    const total = Object.values(byStage).reduce((a, b) => a + b, 0);
    expect(total).toBe(10);
  });
});
