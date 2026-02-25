import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check } from "lucide-react";

// ─── Testimonials Admin ───────────────────────────────────────────────────────
export function TestimonialsAdmin() {
  const { data: testimonials, refetch } = trpc.testimonials.getAll.useQuery();
  const upsert = trpc.testimonials.upsert.useMutation({
    onSuccess: () => { toast.success("Depoimento salvo!"); refetch(); setEditing(null); },
  });
  const del = trpc.testimonials.delete.useMutation({
    onSuccess: () => { toast.success("Depoimento removido!"); refetch(); },
  });
  const [editing, setEditing] = useState<any>(null);

  const empty = { name: "", role: "", text: "", avatarUrl: "", rating: 5, isPublished: true, order: 0 };

  const save = () => {
    if (!editing?.name || !editing?.text) { toast.error("Nome e depoimento são obrigatórios."); return; }
    upsert.mutate(editing);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Depoimentos</h1>
        <button onClick={() => setEditing(empty)} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Novo
        </button>
      </div>

      {editing && (
        <div className="mb-8 p-6" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
          <h2 className="font-serif text-xl mb-5" style={{ color: "var(--brand-marrom-deep)" }}>
            {editing.id ? "Editar" : "Novo"} Depoimento
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label block mb-1">Nome *</label>
              <input
                className="form-input w-full"
                value={editing.name}
                onChange={e => setEditing((p: any) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label block mb-1">Função / Contexto</label>
              <input
                className="form-input w-full"
                placeholder="ex: Noiva, Artista..."
                value={editing.role || ""}
                onChange={e => setEditing((p: any) => ({ ...p, role: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label block mb-1">Avaliação (1-5)</label>
              <input
                type="number" min={1} max={5}
                className="form-input w-full"
                value={editing.rating || 5}
                onChange={e => setEditing((p: any) => ({ ...p, rating: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="form-label block mb-1">Foto (URL)</label>
              <input
                className="form-input w-full"
                placeholder="https://..."
                value={editing.avatarUrl || ""}
                onChange={e => setEditing((p: any) => ({ ...p, avatarUrl: e.target.value }))}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label block mb-1">Depoimento *</label>
            <textarea
              rows={4}
              className="form-input w-full resize-none"
              value={editing.text}
              onChange={e => setEditing((p: any) => ({ ...p, text: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ fontFamily: "'Inter', sans-serif", color: "var(--brand-marrom)" }}>
              <input
                type="checkbox"
                checked={editing.isPublished ?? true}
                onChange={e => setEditing((p: any) => ({ ...p, isPublished: e.target.checked }))}
              />
              Publicado
            </label>
            <div className="flex gap-3 ml-auto">
              <button onClick={() => setEditing(null)} className="btn-outline-dark">Cancelar</button>
              <button onClick={save} disabled={upsert.isPending} className="btn-primary flex items-center gap-2">
                <Check size={14} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {testimonials?.map(t => (
          <div key={t.id} className="flex items-start gap-4 p-5" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{t.name}</span>
                {t.role && <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>· {t.role}</span>}
                {!t.isPublished && (
                  <span className="text-xs px-2 py-0.5" style={{ background: "rgba(201,112,100,0.15)", color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>Oculto</span>
                )}
              </div>
              <p className="text-sm italic" style={{ color: "var(--brand-marrom)", fontFamily: "'Cormorant Garamond', serif" }}>
                "{t.text}"
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditing(t)}
                className="p-2 bg-transparent border-none cursor-pointer"
                style={{ color: "var(--brand-marrom)" }}
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => { if (confirm("Remover depoimento?")) del.mutate({ id: t.id }); }}
                className="p-2 bg-transparent border-none cursor-pointer"
                style={{ color: "#e57373" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {(!testimonials || testimonials.length === 0) && (
          <p className="text-center py-12 text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Nenhum depoimento cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Newsletter Admin ─────────────────────────────────────────────────────────
export function NewsletterAdmin() {
  const { data: subscribers, refetch } = trpc.newsletter.getAll.useQuery();
  const del = trpc.newsletter.delete.useMutation({
    onSuccess: () => { toast.success("Inscrito removido!"); refetch(); },
  });

  const active = subscribers?.filter(s => s.isActive) ?? [];
  const inactive = subscribers?.filter(s => !s.isActive) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Newsletter</h1>
          <p className="text-sm mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            {active.length} inscritos ativos · {inactive.length} inativos
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {subscribers?.map(s => (
          <div key={s.id} className="flex items-center gap-4 px-5 py-3" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <div className="flex-1">
              <span className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{s.email}</span>
              {s.name && <span className="text-xs ml-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>({s.name})</span>}
              <span className="text-xs ml-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>via {s.source}</span>
            </div>
            {!s.isActive && (
              <span className="text-xs px-2 py-0.5" style={{ background: "rgba(201,112,100,0.15)", color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>Inativo</span>
            )}
            <button
              onClick={() => { if (confirm("Remover inscrito?")) del.mutate({ id: s.id }); }}
              className="p-2 bg-transparent border-none cursor-pointer"
              style={{ color: "#e57373" }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {(!subscribers || subscribers.length === 0) && (
          <p className="text-center py-12 text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Nenhum inscrito ainda.
          </p>
        )}
      </div>
    </div>
  );
}
