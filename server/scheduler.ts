/**
 * Scheduler — Camilla Vieira Ateliê
 *
 * Configura tarefas agendadas do servidor.
 * Atualmente: agente de blog toda quinta-feira às 9h (horário de Brasília = UTC-3).
 *
 * Cron: "0 12 * * 4"
 *   - 12:00 UTC = 09:00 BRT (UTC-3)
 *   - 4 = quinta-feira (0=domingo, 1=segunda, ..., 4=quinta)
 */

import cron from "node-cron";
import { runBlogAgent } from "./blog-agent";

let schedulerStarted = false;

export function startScheduler(): void {
  if (schedulerStarted) return;
  schedulerStarted = true;

  // ─── Blog Agent: toda quinta-feira às 9h BRT (12h UTC) ───────────────────
  cron.schedule(
    "0 12 * * 4",
    async () => {
      console.log("[Scheduler] Iniciando agente de blog (quinta-feira 9h BRT)...");
      try {
        await runBlogAgent();
      } catch (err) {
        console.error("[Scheduler] Erro no agente de blog:", err);
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );

  console.log("[Scheduler] Agendamentos configurados:");
  console.log("  → Blog Agent: toda quinta-feira às 09:00 (horário de Brasília)");
}
