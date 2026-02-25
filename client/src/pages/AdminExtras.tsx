import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";

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

// ─── BLOG ADMIN ───────────────────────────────────────────────────────────────
export function BlogAdmin() {
  const { data: posts, refetch } = trpc.blog.adminGetAll.useQuery();
  const upsert = trpc.blog.upsert.useMutation({
    onSuccess: () => { refetch(); setEditing(null); toast.success("Post salvo!"); },
    onError: (e) => toast.error(e.message),
  });
  const del = trpc.blog.delete.useMutation({
    onSuccess: () => { refetch(); toast.success("Post removido."); },
  });

  const [editing, setEditing] = useState<any | null>(null);
  const { register, handleSubmit, reset, watch } = useForm<any>();

  const openNew = () => {
    reset({ isPublished: false, isAutoGenerated: false, category: "fotografia", readingTimeMinutes: 5 });
    setEditing({});
  };
  const openEdit = (p: any) => { reset(p); setEditing(p); };

  const onSubmit = (data: any) => {
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (data.content) {
      const words = data.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
      data.wordCount = words;
      data.readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
    }
    upsert.mutate(data);
  };

  const coverImageUrl = watch("coverImageUrl");

  const categoryOptions = [
    { value: "fotografia", label: "Fotografia" },
    { value: "bordado", label: "Bordado & Têxtil" },
    { value: "cinema", label: "Cinema" },
    { value: "ia", label: "IA & Tecnologia" },
    { value: "maternidade", label: "Maternidade" },
    { value: "mentoria", label: "Mentoria" },
    { value: "exposicoes", label: "Exposições" },
    { value: "manifesto", label: "Manifesto" },
  ];

  const formatDate = (d: Date | null | undefined) =>
    d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "Rascunho";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Blog</h1>
          <p className="text-sm mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            {posts?.filter(p => p.isPublished).length ?? 0} publicados · {posts?.filter(p => !p.isPublished).length ?? 0} rascunhos
          </p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Novo Post
        </button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-3xl p-8 mb-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editing.id ? "Editar Post" : "Novo Post"}
              </h2>
              <button onClick={() => setEditing(null)} className="bg-transparent border-none cursor-pointer" style={{ color: "var(--brand-marrom)" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input type="hidden" {...register("id")} />
              <div>
                <label className="form-label">Título *</label>
                <input {...register("title", { required: true })} className="form-input"
                  placeholder="Fotografia não é registro. É presença." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Slug (URL)</label>
                  <input {...register("slug")} className="form-input" placeholder="auto-gerado do título" />
                </div>
                <div>
                  <label className="form-label">Categoria</label>
                  <select {...register("category")} className="form-input">
                    {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Resumo / Excerpt</label>
                <textarea {...register("excerpt")} className="form-input min-h-[60px] resize-none"
                  placeholder="Uma frase que abre o texto com força..." />
              </div>
              <div>
                <label className="form-label">Conteúdo (HTML ou texto)</label>
                <textarea {...register("content", { required: true })} className="form-input font-mono text-xs"
                  style={{ minHeight: "200px", resize: "vertical" }}
                  placeholder="<p>O texto começa aqui...</p>" />
              </div>
              <div>
                <label className="form-label">URL da Imagem de Capa</label>
                <input {...register("coverImageUrl")} className="form-input" placeholder="https://..." />
                {coverImageUrl && (
                  <img src={coverImageUrl} alt="Capa" className="mt-2 rounded max-h-40 object-cover w-full" />
                )}
              </div>
              <div className="pt-4 border-t" style={{ borderColor: "var(--brand-sand)" }}>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>SEO & GEO</p>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="form-label">Meta Título (máx. 70 chars)</label>
                    <input {...register("metaTitle")} className="form-input" maxLength={70}
                      placeholder="Fotografia não é registro — Camilla Vieira" />
                  </div>
                  <div>
                    <label className="form-label">Meta Descrição (máx. 200 chars)</label>
                    <textarea {...register("metaDescription")} className="form-input min-h-[60px] resize-none" maxLength={200}
                      placeholder="Reflexão sobre presença, memória e o ato fotográfico." />
                  </div>
                  <div>
                    <label className="form-label">Palavras-chave (separadas por vírgula)</label>
                    <input {...register("keywords")} className="form-input"
                      placeholder="fotografia, presença, memória, ensaio" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" {...register("isPublished")} className="w-4 h-4" /> Publicar
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={upsert.isPending} className="btn-primary flex-1 justify-center">
                  {upsert.isPending ? "Salvando..." : "Salvar Post"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="btn-outline-dark">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {posts?.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4"
            style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            {p.coverImageUrl && (
              <img src={p.coverImageUrl} alt={p.title} className="w-16 h-16 object-cover rounded flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-base font-medium truncate" style={{ color: "var(--brand-marrom-deep)" }}>{p.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{p.category ?? "—"}</span>
                <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{formatDate(p.publishedAt)}</span>
                {p.isAutoGenerated && (
                  <span className="text-xs px-2 py-0.5" style={{ background: "rgba(201,169,110,0.2)", color: "#a07830", fontFamily: "'Inter', sans-serif" }}>Agente IA</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs px-2 py-0.5"
                style={{
                  background: p.isPublished ? "rgba(100,180,100,0.15)" : "rgba(180,100,100,0.15)",
                  color: p.isPublished ? "#4a7c4a" : "var(--brand-terracota)",
                  fontFamily: "'Inter', sans-serif",
                }}>
                {p.isPublished ? "Publicado" : "Rascunho"}
              </span>
              <button onClick={() => openEdit(p)} className="p-2 bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100" style={{ color: "var(--brand-marrom)" }}>
                <Pencil size={14} />
              </button>
              <button onClick={() => { if (confirm("Remover post?")) del.mutate({ id: p.id }); }}
                className="p-2 bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100" style={{ color: "var(--brand-terracota)" }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {(!posts || posts.length === 0) && (
          <p className="text-center py-16 text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Nenhum post ainda. O agente de IA publicará o primeiro na próxima quinta-feira às 9h.
          </p>
        )}
      </div>
    </div>
  );
}
