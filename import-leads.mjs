#!/usr/bin/env node
/**
 * Import leads from CSV into the leads table.
 * Run: node import-leads.mjs
 */
import { createConnection } from 'mysql2/promise';
import { readFileSync, existsSync } from 'fs';
import { parse } from 'path';

const CSV_FILE = '/home/ubuntu/CRM_LEADS_CAMILLA_VIEIRA.csv';

// Parse CSV manually (no external deps needed)
function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
      else current += char;
    }
    values.push(current.trim());
    return Object.fromEntries(headers.map((h, i) => [h, (values[i] || '').replace(/^"|"$/g, '')]));
  });
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL não encontrada no ambiente');
    process.exit(1);
  }

  console.log('🔌 Conectando ao banco de dados...');
  const conn = await createConnection(dbUrl);

  const csvContent = readFileSync(CSV_FILE, 'utf-8');
  const leads = parseCSV(csvContent);
  console.log(`📥 Importando ${leads.length} leads...`);

  let inserted = 0, skipped = 0, errors = 0;

  for (const lead of leads) {
    const name = (lead.nome || '').trim();
    if (!name || name.toLowerCase() === 'desconhecido') { skipped++; continue; }

    const phone = (lead.telefone || '').trim() || null;
    const email = (lead.email || '').trim() || null;
    const service = (lead.servico_interesse || 'outro').trim();
    const stage = (lead.estagio || 'lead_frio').trim();
    const source = (lead.fonte || 'importado').trim();
    const resumo = (lead.resumo || '').trim();
    const obs = (lead.observacoes || '').trim();
    const notes = [resumo, obs].filter(Boolean).join('\n\n') || null;

    let lastContact = null;
    if (lead.ultimo_contato) {
      try {
        lastContact = new Date(lead.ultimo_contato).getTime();
      } catch {}
    }

    try {
      if (phone) {
        const [rows] = await conn.execute('SELECT id FROM leads WHERE phone = ? LIMIT 1', [phone]);
        if (rows.length > 0) { skipped++; continue; }
      }

      const phoneVal = phone ? phone.slice(0, 30) : null;
      const emailVal = email ? email.slice(0, 320) : null;
      const notesVal = notes ? notes.slice(0, 2000) : null;
      const lastContactVal = lastContact || null;

      await conn.execute(
        'INSERT INTO leads (name, phone, email, service_interest, stage, source, notes, last_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name.slice(0, 255), phoneVal, emailVal, service.slice(0, 50), stage, source.slice(0, 50), notesVal, lastContactVal]
      );
      inserted++;
      console.log(`  ✓ ${name} | ${service} | ${stage}`);
    } catch (e) {
      console.log(`  ⚠️ Erro ao inserir '${name}': ${e.message}`);
      errors++;
    }
  }

  await conn.end();
  console.log(`\n✅ Importação concluída:`);
  console.log(`  Inseridos: ${inserted}`);
  console.log(`  Ignorados: ${skipped}`);
  console.log(`  Erros: ${errors}`);
}

main().catch(console.error);
