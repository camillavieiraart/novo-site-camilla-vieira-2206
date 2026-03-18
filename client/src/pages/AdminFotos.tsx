import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import {
  Camera, Upload, Trash2, ArrowLeft, ImageIcon, Loader2,
  CheckCircle2, AlertCircle, Grid3X3, List, X, ChevronRight
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type UploadStatus = "idle" | "uploading" | "done" | "error";
type UploadItem = {
  id: string;
  file: File;
  preview: string;
  status: UploadStatus;
  progress: number;
  url?: string;
  error?: string;
};

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { slug: "ensaios-femininos", name: "Ensaios Femininos", emoji: "✨", color: "#C4956A" },
  { slug: "gestante", name: "Gestante", emoji: "🤰", color: "#8B7355" },
  { slug: "profissional", name: "Profissional", emoji: "💼", color: "#4C3022" },
  { slug: "casamentos", name: "Casamentos", emoji: "💍", color: "#9B7B6B" },
  { slug: "familia", name: "Família", emoji: "👨‍👩‍👧", color: "#7A6550" },
  { slug: "editoriais", name: "Editoriais", emoji: "📸", color: "#5C4033" },
  { slug: "fotografia-autoral", name: "Fotografia Autoral", emoji: "🎨", color: "#4C3022" },
  { slug: "ceramica", name: "Cerâmica", emoji: "🏺", color: "#A0785A" },
  { slug: "projetos-especiais", name: "Projetos Especiais", emoji: "⭐", color: "#8B6355" },
];

// ─── Upload helpers ───────────────────────────────────────────────────────────
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Category Picker ─────────────────────────────────────────────────────────
function CategoryPicker({ onSelect }: { onSelect: (cat: typeof CATEGORIES[0]) => void }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 py-4 flex items-center gap-3"
        style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
        <Link href="/admin" className="text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-xl text-white">Upload de Fotos</h1>
      </div>

      <div className="flex-1 px-5 py-8">
        <p className="text-sm mb-6 text-center" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
          Escolha a categoria para adicionar fotos
        </p>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => onSelect(cat)}
              className="flex items-center justify-between w-full px-5 py-4 rounded-xl text-left transition-all active:scale-[0.98]"
              style={{ backgroundColor: "white", border: "1px solid var(--brand-sand)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <p className="font-medium text-sm" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                    {cat.name}
                  </p>
                  <CategoryImageCount slug={cat.slug} />
                </div>
              </div>
              <ChevronRight size={18} style={{ color: "var(--brand-sand)" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryImageCount({ slug }: { slug: string }) {
  const { data: images } = trpc.portfolioImages.getByCategory.useQuery({ categorySlug: slug });
  const count = images?.length ?? 0;
  return (
    <p className="text-xs mt-0.5" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>
      {count === 0 ? "Nenhuma foto ainda" : `${count} foto${count !== 1 ? "s" : ""}`}
    </p>
  );
}

// ─── Gallery Manager ──────────────────────────────────────────────────────────
function GalleryManager({ category, onBack }: { category: typeof CATEGORIES[0]; onBack: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: images, refetch } = trpc.portfolioImages.getByCategory.useQuery({ categorySlug: category.slug });
  const getOrCreateShoot = trpc.portfolioImages.getOrCreateDefaultShoot.useMutation();
  const addImage = trpc.portfolioImages.add.useMutation();
  const deleteImage = trpc.portfolioImages.delete.useMutation({
    onSuccess: () => { refetch(); setDeletingId(null); toast.success("Foto removida"); },
    onError: () => { setDeletingId(null); toast.error("Erro ao remover"); },
  });
  const uploadBase64 = trpc.upload.uploadBase64.useMutation();

  const processFiles = useCallback(async (files: File[]) => {
    const validFiles = files.filter(f => f.type.startsWith("image/") && f.size <= 20 * 1024 * 1024);
    if (validFiles.length < files.length) {
      toast.warning(`${files.length - validFiles.length} arquivo(s) ignorado(s) — apenas imagens até 20MB`);
    }
    if (validFiles.length === 0) return;

    // Create upload items with previews
    const items: UploadItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      status: "idle" as UploadStatus,
      progress: 0,
    }));
    setUploads(prev => [...prev, ...items]);

    // Get or create default shoot
    let shootId: number | null = null;
    try {
      shootId = await getOrCreateShoot.mutateAsync({ categorySlug: category.slug });
    } catch {
      toast.error("Erro ao preparar o álbum");
      setUploads(prev => prev.filter(u => !items.find(i => i.id === u.id)));
      return;
    }
    if (!shootId) {
      toast.error("Categoria não encontrada");
      setUploads(prev => prev.filter(u => !items.find(i => i.id === u.id)));
      return;
    }

    // Upload each file
    for (const item of items) {
      setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: "uploading", progress: 10 } : u));
      try {
        const base64 = await readFileAsBase64(item.file);
        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, progress: 40 } : u));

        const ext = item.file.name.split(".").pop() || "jpg";
        const { url } = await uploadBase64.mutateAsync({
          base64,
          filename: `portfolio-${category.slug}-${Date.now()}.${ext}`,
          contentType: item.file.type,
          folder: `portfolio/${category.slug}`,
        });
        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, progress: 80 } : u));

        await addImage.mutateAsync({ shootId: shootId!, imageUrl: url });
        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: "done", progress: 100, url } : u));
      } catch (err) {
        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: "error", error: "Falha no upload" } : u));
      }
    }

    // Refresh gallery and clean up done uploads after delay
    await refetch();
    setTimeout(() => {
      setUploads(prev => prev.filter(u => u.status !== "done"));
    }, 2000);
  }, [category.slug, getOrCreateShoot, uploadBase64, addImage, refetch]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) processFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const activeUploads = uploads.filter(u => u.status !== "done");
  const uploadingCount = uploads.filter(u => u.status === "uploading").length;
  const totalImages = (images?.length ?? 0) + uploads.filter(u => u.status === "uploading" || u.status === "idle").length;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-white/70 hover:text-white transition-colors p-1">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-serif text-base text-white leading-tight">{category.name}</h1>
            <p className="text-xs text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
              {totalImages} foto{totalImages !== 1 ? "s" : ""}
              {uploadingCount > 0 && ` · enviando ${uploadingCount}...`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView(v => v === "grid" ? "list" : "grid")}
            className="p-2 rounded-lg text-white/70 hover:text-white transition-colors">
            {view === "grid" ? <List size={18} /> : <Grid3X3 size={18} />}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all active:scale-95"
            style={{ backgroundColor: "var(--brand-terracota)", color: "white", fontFamily: "'Inter', sans-serif" }}>
            <Camera size={14} /> Adicionar
          </button>
        </div>
      </div>

      {/* Upload progress bar */}
      {uploadingCount > 0 && (
        <div className="px-4 py-2 text-xs flex items-center gap-2"
          style={{ backgroundColor: "var(--brand-bege)", borderBottom: "1px solid var(--brand-sand)", fontFamily: "'Inter', sans-serif", color: "var(--brand-marrom)" }}>
          <Loader2 size={12} className="animate-spin" />
          Enviando {uploadingCount} foto{uploadingCount !== 1 ? "s" : ""}...
        </div>
      )}

      <div className="flex-1 px-4 py-4">
        {/* Drop zone (visible when no images) */}
        {(images?.length ?? 0) === 0 && activeUploads.length === 0 && (
          <div
            className="flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border-2 border-dashed cursor-pointer"
            style={{ borderColor: "var(--brand-sand)", backgroundColor: "var(--brand-bege)" }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--brand-sand)" }}>
              <ImageIcon size={28} style={{ color: "var(--brand-marrom)" }} />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm mb-1" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                Toque para adicionar fotos
              </p>
              <p className="text-xs opacity-60" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Selecione da galeria ou tire uma foto
              </p>
            </div>
          </div>
        )}

        {/* Upload queue */}
        {activeUploads.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium mb-2 tracking-widest uppercase"
              style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Enviando
            </p>
            <div className="flex flex-col gap-2">
              {activeUploads.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "white", border: "1px solid var(--brand-sand)" }}>
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img src={item.preview} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate mb-1.5" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                      {item.file.name}
                    </p>
                    {item.status === "uploading" && (
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--brand-sand)" }}>
                        <div className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%`, backgroundColor: "var(--brand-terracota)" }} />
                      </div>
                    )}
                    {item.status === "error" && (
                      <p className="text-xs text-red-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {item.error}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {item.status === "uploading" && <Loader2 size={16} className="animate-spin" style={{ color: "var(--brand-terracota)" }} />}
                    {item.status === "done" && <CheckCircle2 size={16} className="text-green-500" />}
                    {item.status === "error" && <AlertCircle size={16} className="text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing images gallery */}
        {(images?.length ?? 0) > 0 && (
          <div>
            {activeUploads.length > 0 && (
              <p className="text-xs font-medium mb-2 tracking-widest uppercase"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Galeria
              </p>
            )}
            {view === "grid" ? (
              <div className="grid grid-cols-3 gap-1.5">
                {images!.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img.imageUrl} alt={img.caption ?? ""} className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        if (!confirm("Remover esta foto?")) return;
                        setDeletingId(img.id);
                        deleteImage.mutate({ id: img.id });
                      }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                    >
                      {deletingId === img.id
                        ? <Loader2 size={10} className="animate-spin text-white" />
                        : <X size={10} className="text-white" />}
                    </button>
                  </div>
                ))}
                {/* Add more button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-colors"
                  style={{ backgroundColor: "var(--brand-bege)", border: "2px dashed var(--brand-sand)" }}
                >
                  <Upload size={18} style={{ color: "var(--brand-marrom)", opacity: 0.5 }} />
                  <span className="text-xs" style={{ color: "var(--brand-marrom)", opacity: 0.5, fontFamily: "'Inter', sans-serif" }}>
                    Mais
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {images!.map((img, idx) => (
                  <div key={img.id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: "white", border: "1px solid var(--brand-sand)" }}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <img src={img.imageUrl} alt={img.caption ?? ""} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                        Foto {idx + 1}
                      </p>
                      {img.caption && (
                        <p className="text-xs truncate opacity-60" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                          {img.caption}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (!confirm("Remover esta foto?")) return;
                        setDeletingId(img.id);
                        deleteImage.mutate({ id: img.id });
                      }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: "var(--brand-terracota)" }}
                    >
                      {deletingId === img.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA (when has images) */}
      {(images?.length ?? 0) > 0 && (
        <div className="sticky bottom-0 px-4 pb-6 pt-3"
          style={{ backgroundColor: "var(--brand-bege-light)", borderTop: "1px solid var(--brand-sand)" }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
            style={{ backgroundColor: "var(--brand-marrom-deep)", color: "white", fontFamily: "'Inter', sans-serif" }}
          >
            <Camera size={16} /> Adicionar mais fotos
          </button>
        </div>
      )}

      {/* Hidden file input — multiple + capture for iPhone */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminFotos() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  // Read ?cat= from URL to open directly from PortfolioAdmin
  const catSlugFromUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("cat") : null;
  const initialCat = catSlugFromUrl ? CATEGORIES.find(c => c.slug === catSlugFromUrl) ?? null : null;
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(initialCat);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--brand-marrom)" }} />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
        style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <AlertCircle size={32} style={{ color: "var(--brand-terracota)" }} />
        <p className="text-center text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
          Acesso restrito. Faça login como administradora.
        </p>
        <Link href="/" className="text-xs underline" style={{ color: "var(--brand-terracota)" }}>
          Voltar ao início
        </Link>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <GalleryManager
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return <CategoryPicker onSelect={setSelectedCategory} />;
}
