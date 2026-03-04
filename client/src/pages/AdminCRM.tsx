import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Phone, Mail, Instagram, MapPin, MessageCircle, Plus, X, Edit2,
  ChevronDown, ChevronUp, ExternalLink, User, Copy, Check,
  Search, Filter, Trash2, Calendar, Tag
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Stage = "lead_frio" | "lead_quente" | "negociando" | "fechado" | "perdido";

interface LeadForm {
  leadId: number;
  formType: "onboarding" | "satisfacao";
  token: string;
  status: "pending" | "filled";
}

interface Lead {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  instagram: string | null;
  serviceInterest: string;
  stage: Stage;
  source: string;
  notes: string | null;
  lastContact: number | null;
  createdAt: Date;
  updatedAt: Date;
  forms: LeadForm[];
}

// ─── Stage Config ─────────────────────────────────────────────────────────────
const STAGES: { id: Stage; label: string; color: string; bg: string; border: string }[] = [
  { id: "lead_frio", label: "Lead Frio", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
  { id: "lead_quente", label: "Lead Quente", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { id: "negociando", label: "Negociando", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  { id: "fechado", label: "Fechado ✓", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  { id: "perdido", label: "Perdido", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
];

const SERVICE_LABELS: Record<string, string> = {
  ensaio: "Ensaio",
  obra: "Obra de Arte",
  ceramica: "Cerâmica",
  mentoria: "Mentoria",
  marca_pessoal: "Marca Pessoal",
  print: "Print",
};

// ─── Lead Card ────────────────────────────────────────────────────────────────
function LeadCard({ lead, onClick, isDragging }: { lead: Lead; onClick: () => void; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortDragging ? 0.4 : 1,
  };

  const stage = STAGES.find(s => s.id === lead.stage)!;
  const hasOnboarding = lead.forms?.some(f => f.formType === "onboarding");
  const hasSatisfacao = lead.forms?.some(f => f.formType === "satisfacao");
  const onboardingFilled = lead.forms?.some(f => f.formType === "onboarding" && f.status === "filled");
  const satisfacaoFilled = lead.forms?.some(f => f.formType === "satisfacao" && f.status === "filled");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div
        onClick={onClick}
        className="p-4 rounded-none border transition-all hover:shadow-md"
        style={{
          backgroundColor: "var(--brand-bege)",
          borderColor: "var(--brand-sand)",
          borderLeft: `3px solid ${stage.color}`,
        }}
      >
        {/* Name + service */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-medium text-sm leading-tight" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
              {lead.name}
            </p>
            <span className="text-xs px-1.5 py-0.5 rounded-sm mt-1 inline-block"
              style={{ backgroundColor: "var(--brand-bege-light)", color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
              {SERVICE_LABELS[lead.serviceInterest] || lead.serviceInterest}
            </span>
          </div>
          <Edit2 size={12} className="opacity-0 group-hover:opacity-50 mt-1 flex-shrink-0" style={{ color: "var(--brand-marrom)" }} />
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-1 mb-2">
          {lead.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={10} style={{ color: "var(--brand-terracota)" }} />
              <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{lead.phone}</span>
            </div>
          )}
          {lead.city && (
            <div className="flex items-center gap-1.5">
              <MapPin size={10} style={{ color: "var(--brand-terracota)" }} />
              <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{lead.city}</span>
            </div>
          )}
        </div>

        {/* Form badges */}
        {(hasOnboarding || hasSatisfacao) && (
          <div className="flex gap-1 mt-2">
            {hasOnboarding && (
              <span className="text-xs px-1.5 py-0.5 rounded-sm"
                style={{
                  backgroundColor: onboardingFilled ? "#D1FAE5" : "#FEF3C7",
                  color: onboardingFilled ? "#065F46" : "#92400E",
                  fontFamily: "'Inter', sans-serif",
                }}>
                {onboardingFilled ? "✓ Onboarding" : "⏳ Onboarding"}
              </span>
            )}
            {hasSatisfacao && (
              <span className="text-xs px-1.5 py-0.5 rounded-sm"
                style={{
                  backgroundColor: satisfacaoFilled ? "#D1FAE5" : "#FEF3C7",
                  color: satisfacaoFilled ? "#065F46" : "#92400E",
                  fontFamily: "'Inter', sans-serif",
                }}>
                {satisfacaoFilled ? "✓ NPS" : "⏳ NPS"}
              </span>
            )}
          </div>
        )}

        {/* Source */}
        <div className="mt-2 pt-2 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <span className="text-xs" style={{ color: "rgba(92,64,51,0.4)", fontFamily: "'Inter', sans-serif" }}>
            {lead.source === "whatsapp" ? "📱 WhatsApp" : lead.source === "instagram" ? "📸 Instagram" : "✏️ Manual"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────
function KanbanColumn({
  stage,
  leads,
  onLeadClick,
}: {
  stage: typeof STAGES[0];
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}) {
  const ids = leads.map(l => l.id);

  return (
    <div className="flex flex-col min-w-[260px] max-w-[280px] flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5 mb-3 rounded-none"
        style={{ backgroundColor: stage.bg, border: `1px solid ${stage.border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
          <span className="text-sm font-medium" style={{ color: stage.color, fontFamily: "'Inter', sans-serif" }}>
            {stage.label}
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: stage.color + "20", color: stage.color, fontFamily: "'Inter', sans-serif" }}>
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 min-h-[80px]">
          {leads.map(lead => (
            <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
          ))}
          {leads.length === 0 && (
            <div className="flex items-center justify-center h-20 border-2 border-dashed rounded-none"
              style={{ borderColor: stage.border }}>
              <p className="text-xs" style={{ color: "rgba(92,64,51,0.3)", fontFamily: "'Inter', sans-serif" }}>Nenhum lead</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ─── Lead Detail Panel ────────────────────────────────────────────────────────
function LeadDetailPanel({
  lead,
  onClose,
  onUpdate,
  onDelete,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: lead.name,
    phone: lead.phone || "",
    email: lead.email || "",
    city: lead.city || "",
    instagram: lead.instagram || "",
    serviceInterest: lead.serviceInterest,
    stage: lead.stage,
    source: lead.source,
    notes: lead.notes || "",
  });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const updateMutation = trpc.leads.updateLead.useMutation({
    onSuccess: () => { toast.success("Lead atualizado!"); setEditing(false); onUpdate(); },
    onError: () => toast.error("Erro ao atualizar lead"),
  });

  const deleteMutation = trpc.leads.deleteLead.useMutation({
    onSuccess: () => { toast.success("Lead removido"); onDelete(); },
    onError: () => toast.error("Erro ao remover lead"),
  });

  const handleSave = () => {
    updateMutation.mutate({ id: lead.id, ...form });
  };

  const handleDelete = () => {
    if (confirm(`Remover "${lead.name}" do pipeline?`)) {
      deleteMutation.mutate({ id: lead.id });
    }
  };

  const copyLink = async (token: string) => {
    const url = `${window.location.origin}/form/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
    toast.success("Link copiado!");
  };

  const stage = STAGES.find(s => s.id === lead.stage)!;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="h-full w-full max-w-md overflow-y-auto shadow-2xl"
        style={{ backgroundColor: "var(--brand-bege-light)" }}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "var(--brand-marrom-deep)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div>
            <p className="font-serif text-lg font-medium" style={{ color: "var(--brand-bege)" }}>{lead.name}</p>
            <span className="text-xs px-2 py-0.5 rounded-sm mt-1 inline-block"
              style={{ backgroundColor: stage.color + "30", color: stage.color, fontFamily: "'Inter', sans-serif" }}>
              {stage.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(!editing)}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: editing ? "var(--brand-terracota)" : "rgba(255,255,255,0.1)", color: "var(--brand-bege)" }}>
              <Edit2 size={14} />
            </button>
            <button onClick={onClose}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "var(--brand-bege)" }}>
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Edit form */}
          {editing ? (
            <div className="flex flex-col gap-4">
              <h3 className="font-serif text-base font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Editar Lead</h3>

              {[
                { label: "Nome", key: "name", type: "text" },
                { label: "Telefone / WhatsApp", key: "phone", type: "text" },
                { label: "E-mail", key: "email", type: "email" },
                { label: "Cidade", key: "city", type: "text" },
                { label: "Instagram", key: "instagram", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs tracking-widest uppercase mb-1"
                    style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border outline-none"
                    style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs tracking-widest uppercase mb-1"
                  style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Estágio</label>
                <select
                  value={form.stage}
                  onChange={e => setForm(f => ({ ...f, stage: e.target.value as Stage }))}
                  className="w-full px-3 py-2 text-sm border outline-none"
                  style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase mb-1"
                  style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Serviço de Interesse</label>
                <select
                  value={form.serviceInterest}
                  onChange={e => setForm(f => ({ ...f, serviceInterest: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border outline-none"
                  style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                  {Object.entries(SERVICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-widest uppercase mb-1"
                  style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Notas</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border outline-none resize-none"
                  style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} disabled={updateMutation.isPending}
                  className="flex-1 py-2 text-sm font-medium"
                  style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                  {updateMutation.isPending ? "Salvando..." : "Salvar"}
                </button>
                <button onClick={() => setEditing(false)}
                  className="flex-1 py-2 text-sm font-medium border"
                  style={{ borderColor: "var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Contact info */}
              <div>
                <h3 className="font-serif text-base font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>Contato</h3>
                <div className="flex flex-col gap-2">
                  {lead.phone && (
                    <a href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 no-underline transition-colors hover:opacity-80"
                      style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                      <MessageCircle size={16} style={{ color: "#25D366" }} />
                      <div>
                        <p className="text-xs" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>WhatsApp</p>
                        <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{lead.phone}</p>
                      </div>
                      <ExternalLink size={12} className="ml-auto" style={{ color: "var(--brand-marrom)" }} />
                    </a>
                  )}
                  {lead.email && (
                    <a href={`mailto:${lead.email}`}
                      className="flex items-center gap-3 p-3 no-underline transition-colors hover:opacity-80"
                      style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                      <Mail size={16} style={{ color: "var(--brand-terracota)" }} />
                      <div>
                        <p className="text-xs" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>E-mail</p>
                        <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{lead.email}</p>
                      </div>
                    </a>
                  )}
                  {lead.instagram && (
                    <a href={`https://instagram.com/${lead.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 no-underline transition-colors hover:opacity-80"
                      style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                      <Instagram size={16} style={{ color: "#E1306C" }} />
                      <div>
                        <p className="text-xs" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>Instagram</p>
                        <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{lead.instagram}</p>
                      </div>
                      <ExternalLink size={12} className="ml-auto" style={{ color: "var(--brand-marrom)" }} />
                    </a>
                  )}
                  {lead.city && (
                    <div className="flex items-center gap-3 p-3"
                      style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                      <MapPin size={16} style={{ color: "var(--brand-terracota)" }} />
                      <div>
                        <p className="text-xs" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>Cidade</p>
                        <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{lead.city}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div>
                  <h3 className="font-serif text-base font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>Notas</h3>
                  <div className="p-4 text-sm leading-relaxed"
                    style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                    {lead.notes}
                  </div>
                </div>
              )}

              {/* Form links */}
              {lead.forms && lead.forms.length > 0 && (
                <div>
                  <h3 className="font-serif text-base font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>Formulários</h3>
                  <div className="flex flex-col gap-2">
                    {lead.forms.map(f => (
                      <div key={f.token} className="p-3 flex items-center justify-between"
                        style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                        <div>
                          <p className="text-xs font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                            {f.formType === "onboarding" ? "📋 Onboarding" : "⭐ Satisfação/NPS"}
                          </p>
                          <span className="text-xs px-1.5 py-0.5 rounded-sm"
                            style={{
                              backgroundColor: f.status === "filled" ? "#D1FAE5" : "#FEF3C7",
                              color: f.status === "filled" ? "#065F46" : "#92400E",
                              fontFamily: "'Inter', sans-serif",
                            }}>
                            {f.status === "filled" ? "✓ Preenchido" : "⏳ Pendente"}
                          </span>
                        </div>
                        <button onClick={() => copyLink(f.token)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors"
                          style={{
                            backgroundColor: copiedToken === f.token ? "#D1FAE5" : "var(--brand-terracota)",
                            color: copiedToken === f.token ? "#065F46" : "var(--brand-bege)",
                            fontFamily: "'Inter', sans-serif",
                          }}>
                          {copiedToken === f.token ? <Check size={12} /> : <Copy size={12} />}
                          {copiedToken === f.token ? "Copiado!" : "Copiar link"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t" style={{ borderColor: "var(--brand-sand)" }}>
                <div className="flex flex-col gap-1">
                  <p className="text-xs" style={{ color: "rgba(92,64,51,0.5)", fontFamily: "'Inter', sans-serif" }}>
                    Criado em: {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(92,64,51,0.5)", fontFamily: "'Inter', sans-serif" }}>
                    Origem: {lead.source}
                  </p>
                </div>
              </div>

              {/* Delete */}
              <button onClick={handleDelete} disabled={deleteMutation.isPending}
                className="flex items-center gap-2 text-xs py-2 px-3 border transition-colors"
                style={{ borderColor: "#FCA5A5", color: "#DC2626", fontFamily: "'Inter', sans-serif" }}>
                <Trash2 size={12} />
                {deleteMutation.isPending ? "Removendo..." : "Remover lead"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── New Lead Modal ────────────────────────────────────────────────────────────
function NewLeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    instagram: "",
    serviceInterest: "ensaio",
    stage: "lead_frio" as Stage,
    source: "manual",
    notes: "",
  });

  const createMutation = trpc.leads.createLead.useMutation({
    onSuccess: () => { toast.success("Lead criado!"); onCreated(); onClose(); },
    onError: () => toast.error("Erro ao criar lead"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
          <h2 className="font-serif text-lg font-medium" style={{ color: "var(--brand-bege)" }}>Novo Lead</h2>
          <button onClick={onClose} style={{ color: "var(--brand-bege)" }}><X size={18} /></button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {[
            { label: "Nome *", key: "name", type: "text", required: true },
            { label: "Telefone / WhatsApp", key: "phone", type: "text" },
            { label: "E-mail", key: "email", type: "email" },
            { label: "Cidade", key: "city", type: "text" },
            { label: "Instagram", key: "instagram", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-xs tracking-widest uppercase mb-1"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{label}</label>
              <input
                type={type}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border outline-none"
                style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Estágio</label>
              <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value as Stage }))}
                className="w-full px-3 py-2 text-sm border outline-none"
                style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-1"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Serviço</label>
              <select value={form.serviceInterest} onChange={e => setForm(f => ({ ...f, serviceInterest: e.target.value }))}
                className="w-full px-3 py-2 text-sm border outline-none"
                style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                {Object.entries(SERVICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase mb-1"
              style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Notas</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3} className="w-full px-3 py-2 text-sm border outline-none resize-none"
              style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => createMutation.mutate(form)} disabled={!form.name || createMutation.isPending}
              className="flex-1 py-2.5 text-sm font-medium"
              style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
              {createMutation.isPending ? "Criando..." : "Criar Lead"}
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium border"
              style={{ borderColor: "var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main CRM Kanban ──────────────────────────────────────────────────────────
export function CRMAdmin() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: kanban, isLoading, refetch } = trpc.leads.getKanban.useQuery();
  const { data: stats } = trpc.leads.getStats.useQuery();

  const moveStageMutation = trpc.leads.moveStage.useMutation({
    onSuccess: () => { utils.leads.getKanban.invalidate(); utils.leads.getStats.invalidate(); },
    onError: () => toast.error("Erro ao mover lead"),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || !kanban) return;

    const activeLeadId = active.id as number;
    const overId = over.id as string | number;

    // Find which stage the over element belongs to
    let targetStage: Stage | null = null;

    // Check if dropped on a stage column id
    if (typeof overId === "string" && STAGES.some(s => s.id === overId)) {
      targetStage = overId as Stage;
    } else {
      // Find the lead and its stage
      for (const [stage, leads] of Object.entries(kanban)) {
        if (leads.some((l: Lead) => l.id === overId)) {
          targetStage = stage as Stage;
          break;
        }
      }
    }

    if (!targetStage) return;

    // Find current stage of active lead
    let currentStage: Stage | null = null;
    for (const [stage, leads] of Object.entries(kanban)) {
      if (leads.some((l: Lead) => l.id === activeLeadId)) {
        currentStage = stage as Stage;
        break;
      }
    }

    if (currentStage !== targetStage) {
      moveStageMutation.mutate({ id: activeLeadId, stage: targetStage });
    }
  };

  // Filter leads by search
  const filteredKanban = kanban
    ? Object.fromEntries(
        Object.entries(kanban).map(([stage, leads]) => [
          stage,
          search
            ? (leads as Lead[]).filter(l =>
                l.name.toLowerCase().includes(search.toLowerCase()) ||
                (l.phone && l.phone.includes(search)) ||
                (l.city && l.city.toLowerCase().includes(search.toLowerCase()))
              )
            : leads,
        ])
      )
    : null;

  const totalLeads = stats ? Object.values(stats.byStage).reduce((a, b) => a + b, 0) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--brand-terracota)" }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
            Pipeline de Leads
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            {totalLeads} leads no pipeline
          </p>
        </div>
        <button onClick={() => setShowNewLead(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
          style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
          <Plus size={16} />
          Novo Lead
        </button>
      </div>

      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-5 gap-2 mb-6">
          {STAGES.map(s => (
            <div key={s.id} className="p-3 text-center"
              style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}>
              <p className="text-xl font-bold" style={{ color: s.color, fontFamily: "'Inter', sans-serif" }}>
                {stats.byStage[s.id] || 0}
              </p>
              <p className="text-xs mt-0.5" style={{ color: s.color, fontFamily: "'Inter', sans-serif" }}>
                {s.label.replace(" ✓", "")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--brand-marrom)" }} />
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou cidade..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border outline-none"
          style={{
            borderColor: "var(--brand-sand)",
            backgroundColor: "var(--brand-bege)",
            color: "var(--brand-marrom-deep)",
            fontFamily: "'Inter', sans-serif",
          }}
        />
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4" style={{ minWidth: "max-content" }}>
            {STAGES.map(stage => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                leads={(filteredKanban?.[stage.id] as Lead[]) || []}
                onLeadClick={setSelectedLead}
              />
            ))}
          </div>

          <DragOverlay>
            {activeId && kanban && (() => {
              const lead = Object.values(kanban).flat().find((l: any) => l.id === activeId) as Lead | undefined;
              if (!lead) return null;
              return (
                <div className="p-4 shadow-2xl border-l-4 rotate-2"
                  style={{
                    backgroundColor: "var(--brand-bege)",
                    borderColor: STAGES.find(s => s.id === lead.stage)?.color || "var(--brand-terracota)",
                    width: "260px",
                  }}>
                  <p className="font-medium text-sm" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                    {lead.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                    {SERVICE_LABELS[lead.serviceInterest] || lead.serviceInterest}
                  </p>
                </div>
              );
            })()}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Lead detail panel */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={() => { refetch(); setSelectedLead(null); }}
          onDelete={() => { refetch(); setSelectedLead(null); }}
        />
      )}

      {/* New lead modal */}
      {showNewLead && (
        <NewLeadModal
          onClose={() => setShowNewLead(false)}
          onCreated={() => { refetch(); utils.leads.getStats.invalidate(); }}
        />
      )}
    </div>
  );
}
