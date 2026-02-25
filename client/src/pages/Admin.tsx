import { useEffect, useState } from "react";
import MediaUploader from "@/components/MediaUploader";
import { Link, useLocation, useRoute } from "wouter";
import {
  LayoutDashboard, Image, Layers, Star, Video, BookOpen,
  MessageSquare, Settings, LogOut, ChevronRight, Upload,
  Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, X, Check,
  Package, Palette, Users, Mail
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { TestimonialsAdmin, NewsletterAdmin, BlogAdmin, CeramicsAdmin, SpecialProjectsAdmin } from "./AdminExtras";

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/portfolio", label: "Portfólio", icon: Layers },
  { href: "/admin/obras", label: "Obras de Arte", icon: Star },
  { href: "/admin/ceramica", label: "Cerâmica", icon: Palette },
  { href: "/admin/fotografia", label: "Fotografia Autoral", icon: Image },
  { href: "/admin/projetos", label: "Projetos Especiais", icon: Package },
  { href: "/admin/videos", label: "Vídeos", icon: Video },
  { href: "/admin/mentorias", label: "Mentorias", icon: BookOpen },
  { href: "/admin/agendamentos", label: "Agendamentos", icon: Users },
  { href: "/admin/mensagens", label: "Mensagens", icon: Mail },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: Star },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
      <div className="p-6 border-b" style={{ borderColor: "rgba(217,204,180,0.1)" }}>
        <Link href="/" className="font-serif text-xl font-medium no-underline" style={{ color: "var(--brand-bege)" }}>
          Camilla.art
        </Link>
        <p className="text-xs mt-1" style={{ color: "rgba(245,230,211,0.5)", fontFamily: "'Inter', sans-serif" }}>Painel Administrativo</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? location === href : location.startsWith(href) && href !== "/admin";
          const isExactAdmin = href === "/admin" && location === "/admin";
          const isActive = isExactAdmin || (!exact && location.startsWith(href));

          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm no-underline mb-0.5 transition-all"
              style={{
                color: isActive ? "var(--brand-bege)" : "rgba(245,230,211,0.55)",
                backgroundColor: isActive ? "rgba(245,230,211,0.1)" : "transparent",
                fontFamily: "'Inter', sans-serif",
              }}
              onClick={onClose}>
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: "rgba(217,204,180,0.1)" }}>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm no-underline mb-1 transition-opacity hover:opacity-100 opacity-60"
          style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
          <Eye size={15} /> Ver Site
        </Link>
        <button onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2.5 text-sm w-full bg-transparent border-none cursor-pointer transition-opacity hover:opacity-100 opacity-60"
          style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
          <LogOut size={15} /> Sair
        </button>
      </div>
    </div>
  );
}

// ─── Upload helper (legacy removed — using MediaUploader component) ──────────

// ─── Dashboard Overview ───────────────────────────────────────────────────────
function AdminDashboard() {
  const { data: artworks } = trpc.artworks.getAllAdmin.useQuery();
  const { data: bookings } = trpc.bookings.getAll.useQuery();
  const { data: messages } = trpc.contact.getAll.useQuery();
  const { data: categories } = trpc.categories.getAllAdmin.useQuery();

  const stats = [
    { label: "Categorias de Portfólio", value: categories?.length || 0, icon: Layers, href: "/admin/portfolio" },
    { label: "Obras de Arte", value: artworks?.length || 0, icon: Star, href: "/admin/obras" },
    { label: "Agendamentos", value: bookings?.length || 0, icon: Users, href: "/admin/agendamentos" },
    { label: "Mensagens", value: messages?.length || 0, icon: Mail, href: "/admin/mensagens" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium mb-8" style={{ color: "var(--brand-marrom-deep)" }}>Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="p-6 no-underline transition-all hover:shadow-md"
            style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <div className="flex items-center gap-3 mb-3">
              <Icon size={16} style={{ color: "var(--brand-terracota)" }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>{label}</span>
            </div>
            <p className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{value}</p>
          </Link>
        ))}
      </div>

      <div className="p-6" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
        <h2 className="font-serif text-xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Acesso Rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {NAV_ITEMS.slice(1).map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2 p-3 no-underline transition-all hover:opacity-80"
              style={{ color: "var(--brand-marrom)", border: "1px solid var(--brand-sand)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>
              <Icon size={14} style={{ color: "var(--brand-terracota)" }} />
              {label}
              <ChevronRight size={12} className="ml-auto" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Artworks Admin ───────────────────────────────────────────────────────────
function ArtworksAdmin() {
  const { data: artworks, refetch } = trpc.artworks.getAllAdmin.useQuery();
  const upsert = trpc.artworks.upsert.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Obra salva!"); } });
  const del = trpc.artworks.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Obra removida."); } });

  const [editing, setEditing] = useState<any | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>();

  const openNew = () => { reset({ isActive: true, isAvailable: true, series: "Fio" }); setEditing({}); };
  const openEdit = (a: any) => { reset(a); setEditing(a); };
  const onSubmit = (data: any) => {
    if (!data.slug && data.title) data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    upsert.mutate(data);
  };

  const imageUrl = watch("imageUrl");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Obras de Arte</h1>
        <button onClick={openNew} className="btn-primary">
          <Plus size={14} /> Nova Obra
        </button>
      </div>

      {/* Form modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-2xl p-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editing.id ? "Editar Obra" : "Nova Obra"}
              </h2>
              <button onClick={() => setEditing(null)} className="bg-transparent border-none cursor-pointer" style={{ color: "var(--brand-marrom)" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input type="hidden" {...register("id")} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Título *</label>
                  <input {...register("title", { required: true })} className="form-input" placeholder="Fio I — Raízes" />
                </div>
                <div>
                  <label className="form-label">Série</label>
                  <input {...register("series")} className="form-input" placeholder="Fio" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Ano</label>
                  <input {...register("year")} className="form-input" placeholder="2024" />
                </div>
                <div>
                  <label className="form-label">Dimensões</label>
                  <input {...register("dimensions")} className="form-input" placeholder="40 × 50 cm" />
                </div>
              </div>
              <div>
                <label className="form-label">Técnica</label>
                <input {...register("technique")} className="form-input" placeholder="Costura sobre fotografia" />
              </div>
              <div>
                <label className="form-label">Descrição</label>
                <textarea {...register("description")} className="form-input min-h-[80px] resize-none" />
              </div>
              <div>
                <label className="form-label">Texto Poético</label>
                <textarea {...register("poeticText")} className="form-input min-h-[60px] resize-none" placeholder="Uma frase poética sobre a obra..." />
              </div>
              <div>
                <label className="form-label">Preço (exibição)</label>
                <input {...register("priceDisplay")} className="form-input" placeholder="R$ 2.800" />
              </div>
              <div>
                <label className="form-label">Áudio Narrado (URL)</label>
                <input {...register("audioUrl")} className="form-input" placeholder="https://cdn.../audio.mp3" />
                <p className="text-xs mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>URL do áudio narrado da obra (Série Fio)</p>
              </div>
              <div>
                <label className="form-label">Vídeo Narrado (URL)</label>
                <input {...register("videoUrl")} className="form-input" placeholder="https://youtube.com/watch?v=... ou URL direta" />
                <p className="text-xs mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>URL do vídeo narrado da obra</p>
              </div>
              <div>
                <MediaUploader
                  label="Imagem Principal"
                  value={imageUrl}
                  onChange={(url) => setValue("imageUrl", url)}
                  onClear={() => setValue("imageUrl", "")}
                  folder="obras"
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
                  {upsert.isPending ? "Salvando..." : "Salvar Obra"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="btn-outline-dark">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {artworks?.map((a) => (
          <div key={a.id} className="artwork-card" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <div className="aspect-square overflow-hidden">
              <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="font-serif text-sm font-medium mb-1 truncate" style={{ color: "var(--brand-marrom-deep)" }}>{a.title}</p>
              <p className="text-xs mb-2 truncate" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{a.series} · {a.year}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(a)} className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer transition-opacity hover:opacity-100 opacity-70"
                  style={{ color: "var(--brand-marrom)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                  <Pencil size={10} /> Editar
                </button>
                <button onClick={() => { if (confirm("Remover obra?")) del.mutate({ id: a.id }); }}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer transition-opacity hover:opacity-100 opacity-70"
                  style={{ color: "var(--brand-terracota)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                  <Trash2 size={10} /> Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mentorships Admin ────────────────────────────────────────────────────────
function MentorshipsAdmin() {
  const { data: mentorships, refetch } = trpc.mentorships.getAllAdmin.useQuery();
  const upsert = trpc.mentorships.upsert.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Mentoria salva!"); } });
  const del = trpc.mentorships.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Mentoria removida."); } });
  const [editing, setEditing] = useState<any | null>(null);
  const { register, handleSubmit, reset } = useForm<any>();

  const openNew = () => { reset({ isActive: true, isFeatured: false }); setEditing({}); };
  const openEdit = (m: any) => { reset(m); setEditing(m); };
  const onSubmit = (data: any) => upsert.mutate(data);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Mentorias</h1>
        <button onClick={openNew} className="btn-primary"><Plus size={14} /> Nova Mentoria</button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-2xl p-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editing.id ? "Editar Mentoria" : "Nova Mentoria"}
              </h2>
              <button onClick={() => setEditing(null)} className="bg-transparent border-none cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input type="hidden" {...register("id")} />
              <div>
                <label className="form-label">Título *</label>
                <input {...register("title", { required: true })} className="form-input" />
              </div>
              <div>
                <label className="form-label">Descrição</label>
                <textarea {...register("description")} className="form-input min-h-[80px] resize-none" />
              </div>
              <div>
                <label className="form-label">Detalhes (um por linha, separados por vírgula)</label>
                <textarea {...register("details")} className="form-input min-h-[80px] resize-none" placeholder='["Item 1", "Item 2"]' />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Duração</label>
                  <input {...register("duration")} className="form-input" placeholder="2 horas" />
                </div>
                <div>
                  <label className="form-label">Modalidade</label>
                  <input {...register("modality")} className="form-input" placeholder="Online ou Presencial" />
                </div>
              </div>
              <div>
                <label className="form-label">Preço (exibição)</label>
                <input {...register("priceDisplay")} className="form-input" placeholder="R$ 450" />
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
                  {upsert.isPending ? "Salvando..." : "Salvar"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="btn-outline-dark">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {mentorships?.map((m) => (
          <div key={m.id} className="flex items-center gap-4 p-4" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <div className="flex-1">
              <p className="font-serif text-base font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{m.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{m.duration} · {m.modality} · {m.priceDisplay}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(m)} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-transparent border cursor-pointer"
                style={{ color: "var(--brand-marrom)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                <Pencil size={11} /> Editar
              </button>
              <button onClick={() => { if (confirm("Remover?")) del.mutate({ id: m.id }); }}
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-transparent border cursor-pointer"
                style={{ color: "var(--brand-terracota)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                <Trash2 size={11} /> Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bookings Admin ───────────────────────────────────────────────────────────
function BookingsAdmin() {
  const { data: bookings } = trpc.bookings.getAll.useQuery();

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium mb-8" style={{ color: "var(--brand-marrom-deep)" }}>Agendamentos</h1>
      <div className="flex flex-col gap-3">
        {bookings?.length === 0 && (
          <p className="text-sm text-center py-12" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Nenhum agendamento ainda.</p>
        )}
        {bookings?.map((b) => (
          <div key={b.id} className="p-5" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-base font-medium mb-1" style={{ color: "var(--brand-marrom-deep)" }}>{b.name}</p>
                <p className="text-xs mb-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{b.email} · {b.phone}</p>
                {b.message && <p className="text-xs mt-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{b.message}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                  {new Date(b.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Messages Admin ───────────────────────────────────────────────────────────
function MessagesAdmin() {
  const { data: messages, refetch } = trpc.contact.getAll.useQuery();
  const markRead = trpc.contact.markRead.useMutation({ onSuccess: () => refetch() });

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium mb-8" style={{ color: "var(--brand-marrom-deep)" }}>Mensagens</h1>
      <div className="flex flex-col gap-3">
        {messages?.length === 0 && (
          <p className="text-sm text-center py-12" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Nenhuma mensagem ainda.</p>
        )}
        {messages?.map((m) => (
          <div key={m.id} className="p-5 transition-all"
            style={{ backgroundColor: m.isRead ? "var(--brand-bege)" : "rgba(201,112,100,0.06)", border: `1px solid ${m.isRead ? "var(--brand-sand)" : "var(--brand-terracota)"}` }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-serif text-base font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{m.name}</p>
                  {!m.isRead && <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>Nova</span>}
                </div>
                <p className="text-xs mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{m.email} · {m.subject}</p>
                <p className="text-sm" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{m.message}</p>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                <p className="text-xs" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                  {new Date(m.createdAt).toLocaleDateString("pt-BR")}
                </p>
                {!m.isRead && (
                  <button onClick={() => markRead.mutate({ id: m.id })}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer"
                    style={{ color: "var(--brand-marrom)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                    <Check size={10} /> Marcar lida
                  </button>
                )}
                <a href={`mailto:${m.email}`} className="text-xs no-underline transition-opacity hover:opacity-100 opacity-70"
                  style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                  Responder
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Videos Admin ─────────────────────────────────────────────────────────────
function VideosAdmin() {
  const { data: videos, refetch } = trpc.videos.getAllAdmin.useQuery();
  const upsert = trpc.videos.upsert.useMutation({ onSuccess: () => { refetch(); setEditing(null); toast.success("Vídeo salvo!"); } });
  const del = trpc.videos.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Vídeo removido."); } });
  const [editing, setEditing] = useState<any | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>();

  const openNew = () => { reset({ isActive: true, type: "manifesto" }); setEditing({}); };
  const openEdit = (v: any) => { reset(v); setEditing(v); };
  const onSubmit = (data: any) => upsert.mutate(data);
  const thumbUrl = watch("thumbnailUrl");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Vídeos</h1>
        <button onClick={openNew} className="btn-primary"><Plus size={14} /> Novo Vídeo</button>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-2xl p-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editing.id ? "Editar Vídeo" : "Novo Vídeo"}
              </h2>
              <button onClick={() => setEditing(null)} className="bg-transparent border-none cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input type="hidden" {...register("id")} />
              <div>
                <label className="form-label">Título *</label>
                <input {...register("title", { required: true })} className="form-input" />
              </div>
              <div>
                <label className="form-label">Vídeo</label>
                <p className="text-xs mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>Faça upload direto ou cole uma URL (YouTube/Vimeo)</p>
                <MediaUploader
                  value={watch("videoUrl")}
                  onChange={(url) => setValue("videoUrl", url)}
                  onClear={() => setValue("videoUrl", "")}
                  folder="videos"
                  type="video"
                  aspectRatio="video"
                />
                <input {...register("videoUrl", { required: true })} className="form-input mt-2" placeholder="Ou cole URL: https://youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="form-label">Tipo</label>
                <select {...register("type")} className="form-input">
                  <option value="manifesto">Manifesto</option>
                  <option value="bastidores">Bastidores</option>
                  <option value="processo">Processo</option>
                  <option value="depoimento">Depoimento</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <MediaUploader
                  label="Thumbnail"
                  value={thumbUrl}
                  onChange={(url) => setValue("thumbnailUrl", url)}
                  onClear={() => setValue("thumbnailUrl", "")}
                  folder="videos"
                  type="image"
                  aspectRatio="video"
                />
                <input type="hidden" {...register("thumbnailUrl")} />
              </div>
              <div>
                <label className="form-label">Descrição</label>
                <textarea {...register("description")} className="form-input min-h-[60px] resize-none" />
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
                  {upsert.isPending ? "Salvando..." : "Salvar"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="btn-outline-dark">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos?.map((v) => (
          <div key={v.id} className="artwork-card" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            {v.thumbnailUrl && <div className="aspect-video overflow-hidden"><img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" /></div>}
            <div className="p-4">
              <p className="font-serif text-sm font-medium mb-1" style={{ color: "var(--brand-marrom-deep)" }}>{v.title}</p>
              <p className="text-xs mb-3 truncate" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{v.type} · {v.videoUrl}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(v)} className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer"
                  style={{ color: "var(--brand-marrom)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                  <Pencil size={10} /> Editar
                </button>
                <button onClick={() => { if (confirm("Remover?")) del.mutate({ id: v.id }); }}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer"
                  style={{ color: "var(--brand-terracota)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                  <Trash2 size={10} /> Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Portfolio Admin ──────────────────────────────────────────────────────────
function PortfolioAdmin() {
  const { data: categories, refetch } = trpc.categories.getAllAdmin.useQuery();
  const { data: shoots, refetch: refetchShoots } = trpc.shoots.getAll.useQuery();
  const upsertCat = trpc.categories.upsert.useMutation({ onSuccess: () => { refetch(); setEditingCat(null); toast.success("Categoria salva!"); } });
  const delCat = trpc.categories.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Categoria removida."); } });
  const upsertShoot = trpc.shoots.upsert.useMutation({ onSuccess: () => { refetchShoots(); setEditingShoot(null); toast.success("Ensaio salvo!"); } });
  const delShoot = trpc.shoots.delete.useMutation({ onSuccess: () => { refetchShoots(); toast.success("Ensaio removido."); } });

  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [editingShoot, setEditingShoot] = useState<any | null>(null);
  const { register: regCat, handleSubmit: submitCat, reset: resetCat, setValue: setValCat, watch: watchCat } = useForm<any>();
  const { register: regShoot, handleSubmit: submitShoot, reset: resetShoot, setValue: setValShoot, watch: watchShoot } = useForm<any>();

  const openNewCat = () => { resetCat({ isActive: true, type: "ensaio" }); setEditingCat({}); };
  const openEditCat = (c: any) => { resetCat(c); setEditingCat(c); };
  const onSubmitCat = (data: any) => {
    if (!data.slug && data.name) data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    upsertCat.mutate(data);
  };

  const openNewShoot = () => { resetShoot({ isActive: true, categoryId: categories?.[0]?.id }); setEditingShoot({}); };
  const openEditShoot = (s: any) => { resetShoot(s); setEditingShoot(s); };
  const onSubmitShoot = (data: any) => {
    if (!data.slug && data.title) data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    upsertShoot.mutate({ ...data, categoryId: Number(data.categoryId) });
  };

  const coverCat = watchCat("coverImageUrl");
  const coverShoot = watchShoot("coverImageUrl");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Portfólio</h1>
        <div className="flex gap-3">
          <button onClick={openNewCat} className="btn-outline-dark"><Plus size={14} /> Nova Categoria</button>
          <button onClick={openNewShoot} className="btn-primary"><Plus size={14} /> Novo Ensaio</button>
        </div>
      </div>

      {/* Category form */}
      {editingCat !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-lg p-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editingCat.id ? "Editar Categoria" : "Nova Categoria"}
              </h2>
              <button onClick={() => setEditingCat(null)} className="bg-transparent border-none cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={submitCat(onSubmitCat)} className="flex flex-col gap-4">
              <input type="hidden" {...regCat("id")} />
              <div>
                <label className="form-label">Nome *</label>
                <input {...regCat("name", { required: true })} className="form-input" placeholder="Ensaios Femininos" />
              </div>
              <div>
                <label className="form-label">Tipo</label>
                <select {...regCat("type")} className="form-input">
                  <option value="ensaio">Ensaio</option>
                  <option value="fotografia_autoral">Fotografia Autoral</option>
                  <option value="ceramica">Cerâmica</option>
                  <option value="projeto_especial">Projeto Especial</option>
                </select>
              </div>
              <div>
                <label className="form-label">Descrição</label>
                <textarea {...regCat("description")} className="form-input min-h-[60px] resize-none" />
              </div>
              <div>
                <MediaUploader
                  label="Imagem de Capa"
                  value={coverCat}
                  onChange={(url) => setValCat("coverImageUrl", url)}
                  onClear={() => setValCat("coverImageUrl", "")}
                  folder="portfolio"
                  type="image"
                  aspectRatio="landscape"
                />
                <input type="hidden" {...regCat("coverImageUrl")} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                <input type="checkbox" {...regCat("isActive")} className="w-4 h-4" /> Ativo
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={upsertCat.isPending} className="btn-primary flex-1 justify-center">
                  {upsertCat.isPending ? "Salvando..." : "Salvar"}
                </button>
                <button type="button" onClick={() => setEditingCat(null)} className="btn-outline-dark">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shoot form */}
      {editingShoot !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-lg p-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {editingShoot.id ? "Editar Ensaio" : "Novo Ensaio"}
              </h2>
              <button onClick={() => setEditingShoot(null)} className="bg-transparent border-none cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={submitShoot(onSubmitShoot)} className="flex flex-col gap-4">
              <input type="hidden" {...regShoot("id")} />
              <div>
                <label className="form-label">Título *</label>
                <input {...regShoot("title", { required: true })} className="form-input" />
              </div>
              <div>
                <label className="form-label">Categoria *</label>
                <select {...regShoot("categoryId", { required: true })} className="form-input">
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Descrição</label>
                <textarea {...regShoot("description")} className="form-input min-h-[60px] resize-none" />
              </div>
              <div>
                <MediaUploader
                  label="Imagem de Capa do Ensaio"
                  value={coverShoot}
                  onChange={(url) => setValShoot("coverImageUrl", url)}
                  onClear={() => setValShoot("coverImageUrl", "")}
                  folder="portfolio"
                  type="image"
                  aspectRatio="portrait"
                />
                <input type="hidden" {...regShoot("coverImageUrl")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Data</label>
                  <input {...regShoot("date")} className="form-input" placeholder="2024" />
                </div>
                <div>
                  <label className="form-label">Local</label>
                  <input {...regShoot("location")} className="form-input" placeholder="São Paulo, SP" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                <input type="checkbox" {...regShoot("isActive")} className="w-4 h-4" /> Ativo
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={upsertShoot.isPending} className="btn-primary flex-1 justify-center">
                  {upsertShoot.isPending ? "Salvando..." : "Salvar"}
                </button>
                <button type="button" onClick={() => setEditingShoot(null)} className="btn-outline-dark">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories */}
      <h2 className="font-serif text-xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Categorias</h2>
      <div className="flex flex-col gap-2 mb-10">
        {categories?.map(c => (
          <div key={c.id} className="flex items-center gap-4 p-4" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            {c.coverImageUrl && <img src={c.coverImageUrl} alt={c.name} className="w-12 h-12 object-cover" />}
            <div className="flex-1">
              <p className="font-serif text-sm font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{c.name}</p>
              <p className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{c.type} · {c.isActive ? "Ativo" : "Inativo"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEditCat(c)} className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer"
                style={{ color: "var(--brand-marrom)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                <Pencil size={10} /> Editar
              </button>
              <button onClick={() => { if (confirm("Remover?")) delCat.mutate({ id: c.id }); }}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer"
                style={{ color: "var(--brand-terracota)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                <Trash2 size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shoots */}
      <h2 className="font-serif text-xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Ensaios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shoots?.map(s => (
          <div key={s.id} className="artwork-card" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            {s.coverImageUrl && <div className="aspect-[4/3] overflow-hidden"><img src={s.coverImageUrl} alt={s.title} className="w-full h-full object-cover" /></div>}
            <div className="p-3">
              <p className="font-serif text-sm font-medium mb-1" style={{ color: "var(--brand-marrom-deep)" }}>{s.title}</p>
              <p className="text-xs mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{s.date} · {s.location}</p>
              <div className="flex gap-2">
                <button onClick={() => openEditShoot(s)} className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer"
                  style={{ color: "var(--brand-marrom)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                  <Pencil size={10} /> Editar
                </button>
                <button onClick={() => { if (confirm("Remover?")) delShoot.mutate({ id: s.id }); }}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-transparent border cursor-pointer"
                  style={{ color: "var(--brand-terracota)", borderColor: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Admin ───────────────────────────────────────────────────────────
function SettingsAdmin() {
  const { data: settings, refetch } = trpc.settings.getAll.useQuery();
  const upsert = trpc.settings.upsert.useMutation({ onSuccess: () => { refetch(); toast.success("Configuração salva!"); } });
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach(s => { map[s.key] = s.value ?? ""; });
      setValues(map);
    }
  }, [settings]);

  const save = (key: string) => upsert.mutate({ key, value: values[key] || "" });

  const SETTINGS = [
    { key: "whatsapp", label: "WhatsApp (com código do país)", placeholder: "5511999999999" },
    { key: "email", label: "E-mail de Contato", placeholder: "contato@camillavieira.art" },
    { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/camillavieira.art" },
    { key: "youtube", label: "YouTube URL", placeholder: "https://youtube.com/@camillavieira.art" },
    { key: "manifesto_video_url", label: "URL do Vídeo Manifesto", placeholder: "https://youtube.com/watch?v=..." },
    { key: "hero_title", label: "Título da Home", placeholder: "Fotografia é Arte" },
    { key: "hero_subtitle", label: "Subtítulo da Home", placeholder: "Cada imagem carrega alma..." },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium mb-8" style={{ color: "var(--brand-marrom-deep)" }}>Configurações</h1>
      <div className="flex flex-col gap-4 max-w-2xl">
        {/* Vídeo Manifesto com upload direto */}
        <div className="p-5" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
          <label className="form-label mb-2 block">Vídeo Manifesto</label>
          <p className="text-xs mb-3" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>
            Faça upload do vídeo diretamente ou cole uma URL (YouTube/Vimeo)
          </p>
          <MediaUploader
            value={values["manifesto_video_url"] || ""}
            onChange={(url) => {
              setValues(prev => ({ ...prev, manifesto_video_url: url }));
              upsert.mutate({ key: "manifesto_video_url", value: url });
              toast.success("Vídeo salvo!");
            }}
            onClear={() => {
              setValues(prev => ({ ...prev, manifesto_video_url: "" }));
              upsert.mutate({ key: "manifesto_video_url", value: "" });
            }}
            folder="videos"
            type="video"
            aspectRatio="video"
          />
          <div className="flex gap-3 mt-3">
            <input
              value={values["manifesto_video_url"] || ""}
              onChange={e => setValues(prev => ({ ...prev, manifesto_video_url: e.target.value }))}
              className="form-input flex-1"
              placeholder="Ou cole URL: https://youtube.com/watch?v=..."
            />
            <button onClick={() => save("manifesto_video_url")} className="btn-primary shrink-0">
              <Check size={14} /> Salvar
            </button>
          </div>
        </div>

        {SETTINGS.filter(s => s.key !== "manifesto_video_url").map(({ key, label, placeholder }) => (
          <div key={key} className="p-5" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <label className="form-label mb-2 block">{label}</label>
            <div className="flex gap-3">
              <input
                value={values[key] || ""}
                onChange={e => setValues(prev => ({ ...prev, [key]: e.target.value }))}
                className="form-input flex-1"
                placeholder={placeholder}
              />
              <button onClick={() => save(key)} className="btn-primary shrink-0">
                <Check size={14} /> Salvar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Layout ─────────────────────────────────────────────────────────────
function AdminContent() {
  const [location] = useLocation();

  if (location === "/admin") return <AdminDashboard />;
  if (location === "/admin/portfolio") return <PortfolioAdmin />;
  if (location === "/admin/obras") return <ArtworksAdmin />;
  if (location === "/admin/videos") return <VideosAdmin />;
  if (location === "/admin/mentorias") return <MentorshipsAdmin />;
  if (location === "/admin/agendamentos") return <BookingsAdmin />;
  if (location === "/admin/mensagens") return <MessagesAdmin />;
  if (location === "/admin/blog") return <BlogAdmin />;
  if (location === "/admin/depoimentos") return <TestimonialsAdmin />;
  if (location === "/admin/newsletter") return <NewsletterAdmin />;
  if (location === "/admin/ceramica") return <CeramicsAdmin />;
  if (location === "/admin/projetos") return <SpecialProjectsAdmin />;
  if (location === "/admin/configuracoes") return <SettingsAdmin />;

  return (
    <div className="text-center py-20">
      <p className="font-serif text-2xl" style={{ color: "var(--brand-marrom-deep)" }}>Em breve</p>
      <p className="text-sm mt-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Esta seção está sendo desenvolvida.</p>
    </div>
  );
}

export default function Admin() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--brand-terracota)" }} />
        <p className="text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Carregando...</p>
      </div>
    </div>
  );

  if (!user || user.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <div className="text-center p-8 max-w-sm">
        <h1 className="font-serif text-3xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Acesso Restrito</h1>
        <p className="text-sm mb-6" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
          Esta área é exclusiva para administradores.
        </p>
        <Link href="/" className="btn-primary">Voltar ao Site</Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 shrink-0 flex-col overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 overflow-y-auto">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-4 px-4 py-3 border-b" style={{ backgroundColor: "var(--brand-bege)", borderColor: "var(--brand-sand)" }}>
          <button onClick={() => setSidebarOpen(true)} className="bg-transparent border-none cursor-pointer" style={{ color: "var(--brand-marrom-deep)" }}>
            ☰
          </button>
          <span className="font-serif text-base font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Admin</span>
        </div>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <AdminContent />
        </main>
      </div>
    </div>
  );
}
