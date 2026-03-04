import { createConnection } from "mysql2/promise";
import { randomBytes } from "crypto";
import { writeFileSync } from "fs";

const db = await createConnection(process.env.DATABASE_URL);

// Get all imported leads
const [leads] = await db.query("SELECT id, name, phone, stage FROM leads WHERE source IN ('whatsapp', 'vcf') ORDER BY stage, name");

const rows = [];
const inserts = [];

for (const lead of leads) {
  const formType = ["fechado", "negociando"].includes(lead.stage) 
    ? (lead.stage === "fechado" ? "satisfacao" : "onboarding")
    : "onboarding";
  
  const token = randomBytes(16).toString("hex");
  const baseUrl = "https://camillavieira.art";
  const link = `${baseUrl}/${formType}/${token}`;
  
  inserts.push([token, lead.id, lead.name, formType, "pending"]);
  rows.push({
    nome: lead.name,
    telefone: lead.phone || "",
    estagio: lead.stage,
    tipo_formulario: formType,
    link,
    token,
  });
}

// Insert all form tokens into lead_forms table
if (inserts.length > 0) {
  await db.query(
    `INSERT INTO lead_forms (token, lead_id, lead_name, form_type, status, created_at, updated_at) 
     VALUES ? 
     ON DUPLICATE KEY UPDATE token=VALUES(token)`,
    [inserts.map(r => [...r, new Date(), new Date()])]
  );
}

// Generate CSV
const header = "Nome,Telefone,Estágio,Tipo de Formulário,Link para Enviar\n";
const csv = header + rows.map(r => 
  `"${r.nome}","${r.telefone}","${r.estagio}","${r.tipo_formulario}","${r.link}"`
).join("\n");

writeFileSync("/home/ubuntu/LINKS_FORMULARIOS_LEADS.csv", csv, "utf8");

console.log(`✅ ${rows.length} links gerados`);
console.log(`   Onboarding (negociando/frio): ${rows.filter(r => r.tipo_formulario === "onboarding").length}`);
console.log(`   Satisfação (fechados): ${rows.filter(r => r.tipo_formulario === "satisfacao").length}`);
console.log(`\n📄 Arquivo salvo: /home/ubuntu/LINKS_FORMULARIOS_LEADS.csv`);

await db.end();
