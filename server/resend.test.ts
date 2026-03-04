import { describe, it, expect } from "vitest";

describe("Resend API Key", () => {
  it("should have RESEND_API_KEY set in environment", () => {
    const key = process.env.RESEND_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(key?.startsWith("re_")).toBe(true);
  });

  it("should be able to send emails via Resend API", async () => {
    const key = process.env.RESEND_API_KEY;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Camilla Vieira <newsletter@camillavieira.art>",
        to: ["delivered@resend.dev"], // Resend test address - always succeeds
        subject: "Vitest — validação da chave Resend",
        html: "<p>Teste automatizado de validação da chave de API.</p>",
      }),
    });
    const data = await response.json() as { id?: string; statusCode?: number; message?: string };
    expect(response.status).toBe(200);
    expect(data.id).toBeDefined();
  });
});
