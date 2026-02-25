import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Code2, Monitor } from "lucide-react";
import { useForm } from "react-hook-form";
import MediaUploader from "@/components/MediaUploader";

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
              <input className="form-input w-full" value={editing.name}
                onChange={e => setEditing((p: any) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="form-label block mb-1">Função / Contexto</label>
              <input className="form-input w-full" value={editing.role ?? ""}
                onChange={e => setEditing((p: any) => ({ ...p, role: e.target.value }))} />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label block mb-1">Depoimento *</label>
            <textarea className="form-input w-full min-h-[100px] resize-none" value={editing.text}
              onChange={e => setEditing((p: any) => ({ ...p, text: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="form-label block mb-1">Nota (1-5)</label>
              <input type="number" min={1} max={5} className="form-input" value={editing.rating ?? 5}
                onChange={e => setEditing((p: any) => ({ ...p, rating: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="form-label block mb-1">Ordem</label>
              <input type="number" className="form-input" value={editing.order ?? 0}
                onChange={e => setEditing((p: any) => ({ ...p, order: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              <input type="checkbox" checked={editing.isPublished ?? true}
                onChange={e => setEditing((p: any) => ({ ...p, isPublished: e.target.checked }))} />
              Publicado
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="btn-primary">Salvar</button>
            <button onClick={() => setEditing(null)} className="btn-outline-dark">Cancelar</button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {testimonials?.map((t) => (
          <div key={t.id} className="flex items-start gap-4 p-4"
            style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <div className="flex-1">
              <p className="font-serif text-base font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{t.name}</p>
              <p className="text-xs mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{t.role}</p>
              <p className="text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{t.text}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(t)} className="p-2 bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100" style={{ color: "var(--brand-marrom)" }}>
                <Pencil size={14} />
              </button>
              <button onClick={() => { if (confirm("Remover?")) del.mutate({ id: t.id }); }}
                className="p-2 bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100" style={{ color: "var(--brand-terracota)" }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {(!testimonials || testimonials.length === 0) && (
          <p className="text-center py-12 text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Nenhum depoimento ainda.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Newsletter Admin ─────────────────────────────────────────────────────────
export function NewsletterAdmin() {
  const { data: subscribers } = trpc.newsletter.getAll.useQuery();
  const formatDate = (d: Date | null | undefined) =>
    d ? new Date(d).toLocaleDateString("pt-BR") : "—";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Newsletter</h1>
          <p className="text-sm mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            {subscribers?.filter(s => s.isActive).length ?? 0} inscritos ativos
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--brand-sand)" }}>
              <th className="text-left py-3 px-2 text-xs tracking-widest uppercase" style={{ color: "var(--brand-terracota)" }}>E-mail</th>
              <th className="text-left py-3 px-2 text-xs tracking-widest uppercase" style={{ color: "var(--brand-terracota)" }}>Nome</th>
              <th className="text-left py-3 px-2 text-xs tracking-widest uppercase" style={{ color: "var(--brand-terracota)" }}>Data</th>
              <th className="text-left py-3 px-2 text-xs tracking-widest uppercase" style={{ color: "var(--brand-terracota)" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscribers?.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid var(--brand-sand)" }}>
                <td className="py-3 px-2" style={{ color: "var(--brand-marrom-deep)" }}>{s.email}</td>
                <td className="py-3 px-2" style={{ color: "var(--brand-marrom)" }}>{s.name ?? "—"}</td>
                <td className="py-3 px-2" style={{ color: "var(--brand-marrom)" }}>{formatDate(s.createdAt)}</td>
                <td className="py-3 px-2">
                  <span className="text-xs px-2 py-0.5" style={{
                    background: s.isActive ? "rgba(100,180,100,0.15)" : "rgba(180,100,100,0.15)",
                    color: s.isActive ? "#4a7c4a" : "var(--brand-terracota)",
                  }}>
                    {s.isActive ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!subscribers || subscribers.length === 0) && (
          <p className="text-center py-12 text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Nenhum inscrito ainda.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Blog Admin ───────────────────────────────────────────────────────────────
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
  const [previewMode, setPreviewMode] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm<any>();

  const openNew = () => {
    reset({ isPublished: false, isAutoGenerated: false, category: "fotografia", readingTimeMinutes: 5 });
    setEditing({});
    setPreviewMode(false);
  };
  const openEdit = (p: any) => { reset(p); setEditing(p); setPreviewMode(false); };

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
  const contentHtml = watch("content");

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
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-6"
          style={{ backgroundColor: "rgba(76,48,34,0.75)" }}>
          <div className="w-full max-w-4xl mb-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--brand-sand)" }}>
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editing.id ? "Editar Post" : "Novo Post"}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-2 text-xs px-3 py-1.5 border transition-all"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: previewMode ? "var(--brand-bege)" : "var(--brand-marrom)",
                    backgroundColor: previewMode ? "var(--brand-marrom-deep)" : "transparent",
                    borderColor: "var(--brand-sand)",
                  }}>
                  {previewMode ? <><Code2 size={12} /> HTML</> : <><Monitor size={12} /> Preview</>}
                </button>
                <button onClick={() => setEditing(null)} className="bg-transparent border-none cursor-pointer" style={{ color: "var(--brand-marrom)" }}>
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
              <input type="hidden" {...register("id")} />

              {/* Title + Slug */}
              <div>
                <label className="form-label">Título *</label>
                <input {...register("title", { required: true })} className="form-input text-base"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  placeholder="O que Wong Kar-wai ensina sobre fotografar o desejo" />
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

              {/* Excerpt */}
              <div>
                <label className="form-label">Resumo / Excerpt</label>
                <textarea {...register("excerpt")} className="form-input min-h-[60px] resize-none"
                  placeholder="Uma frase que abre o texto com força..." />
              </div>

              {/* Cover Image */}
              <div>
                <label className="form-label">Imagem de Capa</label>
                <MediaUploader
                  value={coverImageUrl}
                  onChange={(url) => setValue("coverImageUrl", url)}
                  onClear={() => setValue("coverImageUrl", "")}
                  folder="blog-covers"
                  type="image"
                  aspectRatio="video"
                />
                <input type="hidden" {...register("coverImageUrl")} />
                <p className="text-xs mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>
                  Ou cole uma URL diretamente:
                </p>
                <input {...register("coverImageUrl")} className="form-input mt-1" placeholder="https://..." />
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label" style={{ marginBottom: 0 }}>Conteúdo</label>
                  <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>
                    {contentHtml ? contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length : 0} palavras
                  </span>
                </div>

                {previewMode ? (
                  /* Live HTML Preview */
                  <div
                    className="blog-content p-6 border min-h-[300px]"
                    style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege-light)" }}
                    dangerouslySetInnerHTML={{ __html: contentHtml || "<p style='color:#9B9B9B;font-style:italic'>Nenhum conteúdo para exibir...</p>" }}
                  />
                ) : (
                  /* HTML Code Editor */
                  <textarea
                    {...register("content", { required: true })}
                    className="form-input font-mono text-xs"
                    style={{ minHeight: "320px", resize: "vertical", lineHeight: 1.6 }}
                    placeholder={`<p class="post-lead">Parágrafo de abertura em itálico maior...</p>\n\n<p>Texto normal do post...</p>\n\n<h2>Título de Seção</h2>\n\n<blockquote><p>Citação em destaque...</p></blockquote>\n\n<div class="post-figure">\n  <img src="URL_DA_IMAGEM" alt="Descrição" />\n  <figcaption>Legenda da imagem</figcaption>\n</div>`}
                  />
                )}

                <p className="text-xs mt-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>
                  Use <code style={{ background: "rgba(201,169,110,0.15)", padding: "1px 4px" }}>class="post-lead"</code> no 1º parágrafo,{" "}
                  <code style={{ background: "rgba(201,169,110,0.15)", padding: "1px 4px" }}>class="post-figure"</code> para imagens,{" "}
                  <code style={{ background: "rgba(201,169,110,0.15)", padding: "1px 4px" }}>class="post-figure--wide"</code> para imagem larga,{" "}
                  <code style={{ background: "rgba(201,169,110,0.15)", padding: "1px 4px" }}>class="post-note"</code> para nota de rodapé.
                </p>
              </div>

              {/* SEO */}
              <div className="pt-4 border-t" style={{ borderColor: "var(--brand-sand)" }}>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>SEO & Metadados</p>
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

              {/* Publish toggle */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" {...register("isPublished")} className="w-4 h-4" /> Publicar imediatamente
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
              <img src={p.coverImageUrl} alt={p.title} className="w-20 h-14 object-cover rounded shrink-0" />
            )}
            {!p.coverImageUrl && (
              <div className="w-20 h-14 rounded shrink-0 flex items-center justify-center"
                style={{ backgroundColor: "var(--brand-bege-mid)" }}>
                <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Sem capa</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-base font-medium truncate" style={{ color: "var(--brand-marrom-deep)" }}>{p.title}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{p.category ?? "—"}</span>
                <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{formatDate(p.publishedAt)}</span>
                <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{p.readingTimeMinutes ?? "?"} min</span>
                {p.isAutoGenerated && (
                  <span className="text-xs px-2 py-0.5" style={{ background: "rgba(201,169,110,0.2)", color: "#a07830", fontFamily: "'Inter', sans-serif" }}>Agente IA</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs px-2 py-0.5"
                style={{
                  background: p.isPublished ? "rgba(100,180,100,0.15)" : "rgba(180,100,100,0.15)",
                  color: p.isPublished ? "#4a7c4a" : "var(--brand-terracota)",
                  fontFamily: "'Inter', sans-serif",
                }}>
                {p.isPublished ? "Publicado" : "Rascunho"}
              </span>
              <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"
                className="p-2 bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100" style={{ color: "var(--brand-marrom)" }}>
                <Eye size={14} />
              </a>
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

// ─── Ceramics Admin ───────────────────────────────────────────────────────────
export function CeramicsAdmin() {
  const { data: ceramics, refetch } = trpc.ceramics.getAllAdmin.useQuery();
  const upsert = trpc.ceramics.upsert.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Cerâmica salva!"); } });
  const del = trpc.ceramics.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Cerâmica removida."); } });

  const [editing, setEditing] = useState<any | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>();

  const openNew = () => { reset({ isActive: true, isAvailable: true }); setEditing({}); };
  const openEdit = (c: any) => { reset(c); setEditing(c); };
  const onSubmit = (data: any) => upsert.mutate(data);
  const imageUrl = watch("imageUrl");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Cerâmica</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Nova Peça
        </button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-2xl p-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editing.id ? "Editar Peça" : "Nova Peça"}
              </h2>
              <button onClick={() => setEditing(null)} className="bg-transparent border-none cursor-pointer" style={{ color: "var(--brand-marrom)" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input type="hidden" {...register("id")} />
              <div>
                <label className="form-label">Título *</label>
                <input {...register("title", { required: true })} className="form-input" placeholder="Tigela Terracota I" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Técnica</label>
                  <input {...register("technique")} className="form-input" placeholder="Modelagem à mão" />
                </div>
                <div>
                  <label className="form-label">Dimensões</label>
                  <input {...register("dimensions")} className="form-input" placeholder="12 × 8 cm" />
                </div>
              </div>
              <div>
                <label className="form-label">Descrição</label>
                <textarea {...register("description")} className="form-input min-h-[80px] resize-none" />
              </div>
              <div>
                <label className="form-label">Preço (exibição)</label>
                <input {...register("priceDisplay")} className="form-input" placeholder="R$ 380" />
              </div>
              <div>
                <MediaUploader
                  label="Imagem Principal"
                  value={imageUrl}
                  onChange={(url) => setValue("imageUrl", url)}
                  onClear={() => setValue("imageUrl", "")}
                  folder="ceramica"
                  type="image"
                  aspectRatio="square"
                />
                <input type="hidden" {...register("imageUrl")} />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" {...register("isActive")} className="w-4 h-4" /> Ativo
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" {...register("isAvailable")} className="w-4 h-4" /> Disponível
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" {...register("isFeatured")} className="w-4 h-4" /> Destaque
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={upsert.isPending} className="btn-primary flex-1 justify-center">
                  {upsert.isPending ? "Salvando..." : "Salvar Peça"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="btn-outline-dark">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ceramics?.map((c) => (
          <div key={c.id} className="artwork-card" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <div className="aspect-square overflow-hidden">
              {c.imageUrl ? (
                <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--brand-bege-mid)" }}>
                  <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Sem imagem</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-serif text-sm font-medium mb-1 truncate" style={{ color: "var(--brand-marrom-deep)" }}>{c.title}</p>
              <p className="text-xs mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{c.technique ?? "—"} · {c.priceDisplay ?? "—"}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(c)} className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer opacity-70 hover:opacity-100"
                  style={{ color: "var(--brand-marrom)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                  <Pencil size={10} /> Editar
                </button>
                <button onClick={() => { if (confirm("Remover?")) del.mutate({ id: c.id }); }}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer opacity-70 hover:opacity-100"
                  style={{ color: "var(--brand-terracota)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                  <Trash2 size={10} /> Remover
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!ceramics || ceramics.length === 0) && (
          <div className="col-span-full text-center py-16">
            <p className="text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Nenhuma peça cadastrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Special Projects Admin ───────────────────────────────────────────────────
export function SpecialProjectsAdmin() {
  const { data: projects, refetch } = trpc.specialProjects.getAllAdmin.useQuery();
  const upsert = trpc.specialProjects.upsert.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Projeto salvo!"); } });
  const del = trpc.specialProjects.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Projeto removido."); } });

  const [editing, setEditing] = useState<any | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>();

  const openNew = () => { reset({ isActive: true, type: "exposicao" }); setEditing({}); };
  const openEdit = (p: any) => { reset(p); setEditing(p); };
  const onSubmit = (data: any) => {
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    upsert.mutate(data);
  };
  const imageUrl = watch("imageUrl");

  const typeOptions = [
    { value: "colaboracao", label: "Colaboração" },
    { value: "exposicao", label: "Exposição" },
    { value: "trabalho_unico", label: "Trabalho Único" },
    { value: "outro", label: "Outro" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Projetos Especiais</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Novo Projeto
        </button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-2xl p-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editing.id ? "Editar Projeto" : "Novo Projeto"}
              </h2>
              <button onClick={() => setEditing(null)} className="bg-transparent border-none cursor-pointer" style={{ color: "var(--brand-marrom)" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input type="hidden" {...register("id")} />
              <div>
                <label className="form-label">Título *</label>
                <input {...register("title", { required: true })} className="form-input" placeholder="Exposição Coletiva — Galeria X" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Slug (URL)</label>
                  <input {...register("slug")} className="form-input" placeholder="auto-gerado" />
                </div>
                <div>
                  <label className="form-label">Tipo</label>
                  <select {...register("type")} className="form-input">
                    {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Descrição</label>
                <textarea {...register("description")} className="form-input min-h-[100px] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Ano</label>
                  <input {...register("year")} className="form-input" placeholder="2024" />
                </div>
                <div>
                  <label className="form-label">Local</label>
                  <input {...register("location")} className="form-input" placeholder="Brasília, DF" />
                </div>
              </div>
              <div>
                <label className="form-label">Link Externo (opcional)</label>
                <input {...register("externalUrl")} className="form-input" placeholder="https://..." />
              </div>
              <div>
                <MediaUploader
                  label="Imagem de Capa"
                  value={imageUrl}
                  onChange={(url) => setValue("imageUrl", url)}
                  onClear={() => setValue("imageUrl", "")}
                  folder="projetos"
                  type="image"
                  aspectRatio="video"
                />
                <input type="hidden" {...register("imageUrl")} />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" {...register("isActive")} className="w-4 h-4" /> Ativo
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" {...register("isFeatured")} className="w-4 h-4" /> Destaque
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={upsert.isPending} className="btn-primary flex-1 justify-center">
                  {upsert.isPending ? "Salvando..." : "Salvar Projeto"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="btn-outline-dark">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {projects?.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4"
            style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            {p.coverImageUrl && (
              <img src={p.coverImageUrl} alt={p.title} className="w-20 h-14 object-cover rounded shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-base font-medium truncate" style={{ color: "var(--brand-marrom-deep)" }}>{p.title}</p>
              <p className="text-xs mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{p.type} · {p.date ?? "—"} · {p.location ?? "—"}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs px-2 py-0.5"
                style={{
                  background: p.isActive ? "rgba(100,180,100,0.15)" : "rgba(180,100,100,0.15)",
                  color: p.isActive ? "#4a7c4a" : "var(--brand-terracota)",
                  fontFamily: "'Inter', sans-serif",
                }}>
                {p.isActive ? "Ativo" : "Inativo"}
              </span>
              <button onClick={() => openEdit(p)} className="p-2 bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100" style={{ color: "var(--brand-marrom)" }}>
                <Pencil size={14} />
              </button>
              <button onClick={() => { if (confirm("Remover projeto?")) del.mutate({ id: p.id }); }}
                className="p-2 bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100" style={{ color: "var(--brand-terracota)" }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {(!projects || projects.length === 0) && (
          <p className="text-center py-16 text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Nenhum projeto especial cadastrado.
          </p>
        )}
      </div>
    </div>
  );
}
