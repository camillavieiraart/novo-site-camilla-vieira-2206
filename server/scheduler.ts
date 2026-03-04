/**
 * Scheduler — Camilla Vieira Ateliê
 *
 * Tarefas agendadas:
 * 1. Blog Agent — toda quinta-feira às 09:00 BRT
 * 2. Newsletter Agent — semanal, rotacionando entre terça (2), quarta (3) e quinta (4)
 *    Horário: 11:00 BRT — pico de engajamento no Brasil
 *
 * A newsletter roda terça, quarta e quinta às 11h, mas verifica internamente
 * se já houve envio nos últimos 5 dias — garantindo envio semanal sem duplicar.
 */

import cron from "node-cron";
import { runBlogAgent } from "./blog-agent";
import { sendNewsletter } from "./newsletter-agent";
import { getDb } from "./db";
import { newslettersSent } from "../drizzle/schema";
import { desc } from "drizzle-orm";

let schedulerStarted = false;

/**
 * Verifica se já houve envio nos últimos 5 dias.
 * Evita duplicação caso o servidor reinicie em dia de envio.
 */
async function wasNewsletterSentRecently(): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) return false;
    const recent = await db
      .select({ sentAt: newslettersSent.sentAt })
      .from(newslettersSent)
      .orderBy(desc(newslettersSent.sentAt))
      .limit(1);
    if (!recent.length || !recent[0].sentAt) return false;
    const lastSent = new Date(recent[0].sentAt).getTime();
    const fiveDaysAgo = Date.now() - 5 * 24 * 60 * 60 * 1000;
    return lastSent > fiveDaysAgo;
  } catch {
    return false;
  }
}

export function startScheduler(): void {
  if (schedulerStarted) return;
  schedulerStarted = true;

  // ─── Blog Agent: toda quinta-feira às 09:00 BRT (12:00 UTC) ─────────────
  cron.schedule(
    "0 12 * * 4",
    async () => {
      console.log("[Scheduler] Iniciando agente de blog (quinta-feira 09:00 BRT)...");
      try {
        await runBlogAgent();
      } catch (err) {
        console.error("[Scheduler] Erro no agente de blog:", err);
      }
    },
    { timezone: "America/Sao_Paulo" }
  );

  // ─── Newsletter Agent: terça, quarta e quinta às 11:00 BRT ──────────────
  // Roda nos 3 dias mas verifica se já enviou nos últimos 5 dias.
  cron.schedule(
    "0 11 * * 2,3,4",
    async () => {
      console.log("[Scheduler] Verificando newsletter semanal...");
      try {
        const alreadySent = await wasNewsletterSentRecently();
        if (alreadySent) {
          console.log("[Scheduler] Newsletter já enviada nos últimos 5 dias. Pulando.");
          return;
        }
        console.log("[Scheduler] Iniciando envio automático da newsletter...");
        const result = await sendNewsletter();
        if (result.success) {
          console.log(
            `[Scheduler] Newsletter enviada para ${result.recipientCount} inscritos (${result.scheduledDay}).`
          );
        } else {
          console.error("[Scheduler] Falha no envio:", result.error);
        }
      } catch (err) {
        console.error("[Scheduler] Erro no agente de newsletter:", err);
      }
    },
    { timezone: "America/Sao_Paulo" }
  );

  console.log("[Scheduler] Agendamentos configurados:");
  console.log("  → Blog Agent: toda quinta-feira às 09:00 (horário de Brasília)");
  console.log("  → Newsletter Agent: terça, quarta e quinta às 11:00 (horário de Brasília) — envio semanal automático");
}
