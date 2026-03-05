import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, Image, Upload, ChevronDown, ChevronUp } from "lucide-react";
import MediaUploader from "@/components/MediaUploader";

// ─── Fotografia Autoral Admin ─────────────────────────────────────────────────
export function FotografiaAdmin() {
  // Category ID 4 = fotografia_autoral
  const AUTORAL_CAT_ID = 4;
  const { data: shoots, refetch: refetchShoots } = trpc.shoots.getByCategory.useQuery({ categoryId: AUTORAL_CAT_ID });
  const upsertShoot = trpc.shoots.upsert.useMutation({ onSuccess: () => { toast.success("Série salva!"); refetchShoots(); setEditingSeries(null); } });
  const deleteShoot = trpc.shoots.delete.useMutation({ onSuccess: () => { toast.success("Série removida!"); refetchShoots(); } });
  const addImage = trpc.portfolioImages.add.useMutation({ onSuccess: () => { toast.success("Foto adicionada!"); setSelectedShoot((s: any) => s ? { ...s, _refresh: Date.now() } : s); } });
  const deleteImage = trpc.portfolioImages.delete.useMutation({ onSuccess: () => { toast.success("Foto removida!"); } });
  type ShootState = { id: number; title: string; slug: string; _refresh?: number } | null;

  const [editingSeries, setEditingSeries] = useState<any>(null);
  const [selectedShoot, setSelectedShoot] = useState<any>(null);
  const [shootImages, setShootImages] = useState<any[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const { data: imagesData } = trpc.portfolioImages.getByShoot.useQuery(
    { shootId: selectedShoot?.id ?? 0 },
    { enabled: !!selectedShoot?.id }
  );

  useEffect(() => {
    if (imagesData) setShootImages(imagesData);
  }, [imagesData, selectedShoot?._refresh]);

  const emptySeries = { categoryId: AUTORAL_CAT_ID, title: "", slug: "", description: "", coverImageUrl: "", isActive: true };

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Fotografia Autoral</h1>
        <button onClick={() => setEditingSeries(emptySeries)} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Nova Série
        </button>
      </div>

      {/* Edit / Create Series Modal */}
      {editingSeries && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editingSeries.id ? "Editar Série" : "Nova Série"}
              </h2>
              <button onClick={() => setEditingSeries(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="form-label mb-1 block">Nome da Série *</label>
                <input
                  value={editingSeries.title}
                  onChange={e => setEditingSeries({ ...editingSeries, title: e.target.value, slug: editingSeries.id ? editingSeries.slug : slugify(e.target.value) })}
                  className="form-input w-full"
                  placeholder="Ex: Série Fio"
                />
              </div>
              <div>
                <label className="form-label mb-1 block">Slug (URL)</label>
                <input
                  value={editingSeries.slug}
                  onChange={e => setEditingSeries({ ...editingSeries, slug: e.target.value })}
                  className="form-input w-full"
                  placeholder="serie-fio"
                />
              </div>
              <div>
                <label className="form-label mb-1 block">Descrição</label>
                <textarea
                  value={editingSeries.description || ""}
                  onChange={e => setEditingSeries({ ...editingSeries, description: e.target.value })}
                  className="form-input w-full"
                  rows={3}
                  placeholder="Descreva a série artística..."
                />
              </div>
              <div>
                <label className="form-label mb-2 block">Imagem de Capa</label>
                <MediaUploader
                  value={editingSeries.coverImageUrl || ""}
                  onChange={url => setEditingSeries({ ...editingSeries, coverImageUrl: url })}
                  onClear={() => setEditingSeries({ ...editingSeries, coverImageUrl: "" })}
                  folder="fotografia-autoral"
                  type="image"
                  aspectRatio="landscape"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="seriesActive"
                  checked={editingSeries.isActive}
                  onChange={e => setEditingSeries({ ...editingSeries, isActive: e.target.checked })}
                />
                <label htmlFor="seriesActive" className="form-label">Série ativa (visível no site)</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingSeries(null)} className="btn-secondary flex-1">Cancelar</button>
              <button
                onClick={() => upsertShoot.mutate(editingSeries)}
                disabled={!editingSeries.title || !editingSeries.slug}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Check size={14} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Series List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {(shoots || []).map((shoot: any) => (
          <div key={shoot.id} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--brand-sand)", backgroundColor: "var(--brand-bege)" }}>
            {shoot.coverImageUrl ? (
              <div className="aspect-[4/3] overflow-hidden">
                <img src={shoot.coverImageUrl} alt={shoot.title} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/3] flex items-center justify-center" style={{ backgroundColor: "var(--brand-sand)" }}>
                <Image size={40} style={{ color: "var(--brand-marrom)", opacity: 0.3 }} />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-serif text-lg font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{shoot.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${shoot.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {shoot.isActive ? "Ativa" : "Oculta"}
                </span>
              </div>
              {shoot.description && (
                <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>{shoot.description}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedShoot(shoot)}
                  className="btn-secondary text-xs flex-1 flex items-center justify-center gap-1"
                >
                  <Upload size={12} /> Fotos
                </button>
                <button onClick={() => setEditingSeries(shoot)} className="btn-secondary text-xs px-3">
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => { if (confirm(`Remover "${shoot.title}"?`)) deleteShoot.mutate({ id: shoot.id }); }}
                  className="text-xs px-3 py-1 rounded text-red-600 hover:bg-red-50 border border-red-200"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!shoots || shoots.length === 0) && (
          <div className="col-span-3 text-center py-16" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.5 }}>
            Nenhuma série criada ainda. Clique em "Nova Série" para começar.
          </div>
        )}
      </div>

      {/* Shoot Images Panel */}
      {selectedShoot && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-serif text-xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                Fotos — {selectedShoot.title}
              </h2>
              <button onClick={() => setSelectedShoot(null)}><X size={20} /></button>
            </div>
            <div className="p-5">
              {/* Add photo */}
              <div className="mb-6 p-4 rounded" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                <label className="form-label mb-2 block">Adicionar Foto</label>
                <MediaUploader
                  value={newImageUrl}
                  onChange={url => {
                    addImage.mutate({ shootId: selectedShoot.id, imageUrl: url });
                    setNewImageUrl("");
                  }}
                  onClear={() => setNewImageUrl("")}
                  folder={`fotografia-autoral/${selectedShoot.slug}`}
                  type="image"
                  aspectRatio="square"
                />
              </div>
              {/* Image grid */}
              <div className="grid grid-cols-3 gap-3">
                {shootImages.map((img: any) => (
                  <div key={img.id} className="relative group aspect-square overflow-hidden rounded">
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => deleteImage.mutate({ id: img.id })}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {shootImages.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-sm" style={{ color: "var(--brand-marrom)", opacity: 0.5, fontFamily: "'Inter', sans-serif" }}>
                    Nenhuma foto ainda. Use o uploader acima para adicionar.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sobre Admin ──────────────────────────────────────────────────────────────
export function SobreAdmin() {
  const { data: settings, refetch } = trpc.settings.getAll.useQuery();
  const upsert = trpc.settings.upsert.useMutation({ onSuccess: () => { refetch(); toast.success("Salvo!"); } });
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setValues(map);
    }
  }, [settings]);

  const save = (key: string) => upsert.mutate({ key, value: values[key] || "" });
  const set = (key: string, val: string) => setValues(prev => ({ ...prev, [key]: val }));

  const SOBRE_FIELDS = [
    { key: "sobre_bio_p1", label: "Biografia — Parágrafo 1", type: "textarea", placeholder: "Comecei a fotografar por necessidade de guardar o que o tempo insiste em levar..." },
    { key: "sobre_bio_p2", label: "Biografia — Parágrafo 2", type: "textarea", placeholder: "Ao longo dos anos, meu trabalho foi se tornando cada vez mais autoral..." },
    { key: "sobre_bio_p3", label: "Biografia — Parágrafo 3", type: "textarea", placeholder: "Hoje, o Ateliê Digital é o espaço onde tudo se encontra..." },
    { key: "sobre_titulo", label: "Título da Seção Hero", type: "text", placeholder: "Fotógrafa, artista visual e criadora do Ateliê Digital" },
    { key: "sobre_subtitulo", label: "Subtítulo do Hero", type: "text", placeholder: "Um espaço onde fotografia e arte se encontram." },
    { key: "sobre_manifesto_1", label: "Manifesto — Frase 1", type: "textarea", placeholder: "Acredito que fotografia é arte. Não apenas registro — é presença." },
    { key: "sobre_manifesto_2", label: "Manifesto — Frase 2", type: "textarea", placeholder: "Meu trabalho transita entre o ensaio fotográfico e a obra de arte..." },
    { key: "sobre_manifesto_3", label: "Manifesto — Frase 3", type: "textarea", placeholder: "Na série Fio, a agulha se torna extensão do olhar..." },
    { key: "sobre_cta_text", label: "Texto do Botão CTA", type: "text", placeholder: "Agendar Ensaio" },
    { key: "sobre_cta_link", label: "Link do Botão CTA", type: "text", placeholder: "/contato" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>Página /sobre</h1>
      <p className="text-sm mb-8" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>
        Edite os textos e a foto da página Sobre. As alterações aparecem imediatamente no site.
      </p>

      {/* Profile photo */}
      <div className="p-5 mb-4 rounded-lg" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
        <label className="form-label mb-2 block">Foto de Perfil (Hero)</label>
        <div className="flex gap-4 items-start">
          {values["sobre_foto_perfil"] && (
            <img src={values["sobre_foto_perfil"]} alt="Perfil" className="w-24 h-24 object-cover rounded-lg shrink-0" />
          )}
          <div className="flex-1">
            <MediaUploader
              value={values["sobre_foto_perfil"] || ""}
              onChange={url => { set("sobre_foto_perfil", url); upsert.mutate({ key: "sobre_foto_perfil", value: url }); toast.success("Foto salva!"); }}
              onClear={() => { set("sobre_foto_perfil", ""); upsert.mutate({ key: "sobre_foto_perfil", value: "" }); }}
              folder="sobre"
              type="image"
              aspectRatio="portrait"
            />
          </div>
        </div>
      </div>

      {/* Segunda foto */}
      <div className="p-5 mb-4 rounded-lg" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
        <label className="form-label mb-2 block">Foto Secundária (Seção de Biografia)</label>
        <div className="flex gap-4 items-start">
          {values["sobre_foto_secundaria"] && (
            <img src={values["sobre_foto_secundaria"]} alt="Secundária" className="w-24 h-24 object-cover rounded-lg shrink-0" />
          )}
          <div className="flex-1">
            <MediaUploader
              value={values["sobre_foto_secundaria"] || ""}
              onChange={url => { set("sobre_foto_secundaria", url); upsert.mutate({ key: "sobre_foto_secundaria", value: url }); toast.success("Foto salva!"); }}
              onClear={() => { set("sobre_foto_secundaria", ""); upsert.mutate({ key: "sobre_foto_secundaria", value: "" }); }}
              folder="sobre"
              type="image"
              aspectRatio="portrait"
            />
          </div>
        </div>
      </div>

      {/* Text fields */}
      <div className="flex flex-col gap-4">
        {SOBRE_FIELDS.map(({ key, label, type, placeholder }) => (
          <div key={key} className="p-5 rounded-lg" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <label className="form-label mb-2 block">{label}</label>
            {type === "textarea" ? (
              <textarea
                value={values[key] || ""}
                onChange={e => set(key, e.target.value)}
                className="form-input w-full mb-3"
                rows={3}
                placeholder={placeholder}
              />
            ) : (
              <input
                value={values[key] || ""}
                onChange={e => set(key, e.target.value)}
                className="form-input w-full mb-3"
                placeholder={placeholder}
              />
            )}
            <button onClick={() => save(key)} className="btn-primary flex items-center gap-2">
              <Check size={14} /> Salvar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Home Admin ───────────────────────────────────────────────────────────────
export function HomeAdmin() {
  const { data: settings, refetch } = trpc.settings.getAll.useQuery();
  const upsert = trpc.settings.upsert.useMutation({ onSuccess: () => { refetch(); toast.success("Salvo!"); } });
  const [values, setValues] = useState<Record<string, string>>({});
  const [openSection, setOpenSection] = useState<string | null>("hero");

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s: any) => { map[s.key] = s.value ?? ""; });
      setValues(map);
    }
  }, [settings]);

  const save = (key: string) => upsert.mutate({ key, value: values[key] || "" });
  const set = (key: string, val: string) => setValues(prev => ({ ...prev, [key]: val }));

  const SECTIONS = [
    {
      id: "hero",
      label: "Hero (Tela Inicial)",
      fields: [
        { key: "hero_title", label: "Título Principal", type: "text", placeholder: "Fotografia é Arte" },
        { key: "hero_subtitle", label: "Subtítulo", type: "text", placeholder: "Cada imagem carrega alma, intenção e beleza autoral" },
        { key: "hero_eyebrow", label: "Texto Pequeno (Eyebrow)", type: "text", placeholder: "Ateliê Digital" },
        { key: "hero_cta1_text", label: "Botão 1 — Texto", type: "text", placeholder: "Explorar Portfólio" },
        { key: "hero_cta1_link", label: "Botão 1 — Link", type: "text", placeholder: "/portfolio" },
        { key: "hero_cta2_text", label: "Botão 2 — Texto", type: "text", placeholder: "Obras de Arte" },
        { key: "hero_cta2_link", label: "Botão 2 — Link", type: "text", placeholder: "/obras" },
      ],
    },
    {
      id: "hero_bg",
      label: "Imagem de Fundo do Hero",
      fields: [],
      hasImage: { key: "hero_bg_image", label: "Imagem de Fundo", folder: "home", aspectRatio: "landscape" as const },
    },
    {
      id: "manifesto",
      label: "Seção Manifesto (Vídeo)",
      fields: [
        { key: "manifesto_title", label: "Título da Seção", type: "text", placeholder: "O Manifesto" },
        { key: "manifesto_line_1", label: "Linha 1 do Manifesto", type: "text", placeholder: "Fotografia é presença." },
        { key: "manifesto_line_2", label: "Linha 2 do Manifesto", type: "text", placeholder: "É o instante que se recusa a desaparecer." },
        { key: "manifesto_line_3", label: "Linha 3 do Manifesto", type: "text", placeholder: "É a alma que a câmera captura." },
        { key: "manifesto_video_url", label: "URL do Vídeo (YouTube/Vimeo ou upload)", type: "text", placeholder: "https://youtube.com/watch?v=..." },
      ],
    },
    {
      id: "ensaios",
      label: "Seção Ensaios com Alma",
      fields: [
        { key: "ensaios_title", label: "Título da Seção", type: "text", placeholder: "Ensaios com Alma" },
        { key: "ensaios_subtitle", label: "Subtítulo", type: "text", placeholder: "Cada ensaio é uma conversa entre a câmera e quem você realmente é." },
        { key: "ensaios_cta_text", label: "Botão CTA — Texto", type: "text", placeholder: "Agendar Ensaio" },
        { key: "ensaios_cta_link", label: "Botão CTA — Link", type: "text", placeholder: "/contato" },
      ],
    },
    {
      id: "obras",
      label: "Seção Obras de Arte",
      fields: [
        { key: "obras_title", label: "Título da Seção", type: "text", placeholder: "Obras de Arte" },
        { key: "obras_subtitle", label: "Subtítulo", type: "text", placeholder: "Além dos ensaios, Camilla cria obras únicas..." },
        { key: "obras_cta_text", label: "Botão CTA — Texto", type: "text", placeholder: "Ver Obras" },
        { key: "obras_cta_link", label: "Botão CTA — Link", type: "text", placeholder: "/obras" },
      ],
    },
    {
      id: "mentorias",
      label: "Seção Mentorias",
      fields: [
        { key: "mentorias_home_title", label: "Título da Seção", type: "text", placeholder: "Mentorias" },
        { key: "mentorias_home_subtitle", label: "Subtítulo", type: "text", placeholder: "Para fotógrafas que querem ir além da técnica..." },
        { key: "mentorias_home_cta_text", label: "Botão CTA — Texto", type: "text", placeholder: "Conhecer Mentorias" },
        { key: "mentorias_home_cta_link", label: "Botão CTA — Link", type: "text", placeholder: "/mentorias" },
      ],
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>Página Home</h1>
      <p className="text-sm mb-8" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>
        Edite os textos e imagens de cada seção da página inicial. As alterações aparecem imediatamente no site.
      </p>

      <div className="flex flex-col gap-3">
        {SECTIONS.map(section => (
          <div key={section.id} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--brand-sand)" }}>
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-4 text-left"
              style={{ backgroundColor: "var(--brand-bege)" }}
            >
              <span className="font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{section.label}</span>
              {openSection === section.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSection === section.id && (
              <div className="p-5 flex flex-col gap-4" style={{ backgroundColor: "white" }}>
                {/* Image uploader if applicable */}
                {section.hasImage && (
                  <div>
                    <label className="form-label mb-2 block">{section.hasImage.label}</label>
                    {values[section.hasImage.key] && (
                      <img src={values[section.hasImage.key]} alt="" className="w-full max-h-40 object-cover rounded mb-3" />
                    )}
                    <MediaUploader
                      value={values[section.hasImage.key] || ""}
                      onChange={url => { set(section.hasImage!.key, url); upsert.mutate({ key: section.hasImage!.key, value: url }); toast.success("Imagem salva!"); }}
                      onClear={() => { set(section.hasImage!.key, ""); upsert.mutate({ key: section.hasImage!.key, value: "" }); }}
                      folder={section.hasImage.folder}
                      type="image"
                      aspectRatio={section.hasImage.aspectRatio}
                    />
                  </div>
                )}

                {/* Text fields */}
                {section.fields.map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="form-label mb-1 block">{label}</label>
                    <div className="flex gap-2">
                      <input
                        value={values[key] || ""}
                        onChange={e => set(key, e.target.value)}
                        className="form-input flex-1"
                        placeholder={placeholder}
                      />
                      <button onClick={() => save(key)} className="btn-primary shrink-0 flex items-center gap-1">
                        <Check size={14} /> Salvar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
        <p className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>
          <strong>Nota:</strong> Os campos com texto padrão mostram o conteúdo atual do site. Ao salvar um valor diferente, ele substitui o texto fixo. Para voltar ao padrão, apague o campo e salve em branco.
        </p>
      </div>
    </div>
  );
}
