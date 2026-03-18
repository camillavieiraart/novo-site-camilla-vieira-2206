import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import MediaUploader from "@/components/MediaUploader";
import {
  Plus, Pencil, Trash2, X, Package, ShoppingBag,
  TrendingUp, Eye, EyeOff, Star, Check, Truck
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  category: string;
  priceInCents: number;
  compareAtPriceInCents: number | null;
  imageUrl: string | null;
  images: string | null;
  deliveryType: string;
  stock: number | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  stripePriceId: string | null;
  stripeProductId: string | null;
  buyUrl?: string | null;
}

interface Order {
  id: number;
  customerEmail: string;
  customerName: string | null;
  productName: string;
  productCategory: string;
  amountInCents: number;
  status: string;
  deliveryType: string | null;
  trackingCode: string | null;
  adminNotes: string | null;
  createdAt: Date;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Aguardando", color: "#92400E", bg: "#FEF3C7" },
  paid: { label: "Pago", color: "#065F46", bg: "#D1FAE5" },
  processing: { label: "Processando", color: "#1E40AF", bg: "#DBEAFE" },
  shipped: { label: "Enviado", color: "#5B21B6", bg: "#EDE9FE" },
  delivered: { label: "Entregue", color: "#065F46", bg: "#D1FAE5" },
  cancelled: { label: "Cancelado", color: "#991B1B", bg: "#FEE2E2" },
  refunded: { label: "Reembolsado", color: "#374151", bg: "#F3F4F6" },
};

// ─── Products Admin ───────────────────────────────────────────────────────────
function ProductsAdmin() {
  const { data: products, refetch } = trpc.shop.adminListProducts.useQuery();
  const upsert = trpc.shop.upsertProduct.useMutation({
    onSuccess: () => { refetch(); setEditing(null); toast.success("Produto salvo!"); },
    onError: (e) => toast.error(e.message || "Erro ao salvar produto"),
  });
  const del = trpc.shop.deleteProduct.useMutation({
    onSuccess: () => { refetch(); toast.success("Produto removido."); },
  });

  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<any>();

  const openNew = () => {
    reset({ isActive: true, isFeatured: false, order: 0, deliveryType: "agendamento", category: "ensaio" });
    setEditing({});
  };
  const openEdit = (p: Product) => { reset(p); setEditing(p); };

  const onSubmit = (data: any) => {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    data.priceInCents = parseInt(data.priceInCents) || 0;
    data.compareAtPriceInCents = data.compareAtPriceInCents ? parseInt(data.compareAtPriceInCents) : undefined;
    data.stock = data.stock !== "" && data.stock !== undefined ? parseInt(data.stock) : undefined;
    data.order = parseInt(data.order) || 0;
    upsert.mutate(data);
  };

  const imageUrl = watch("imageUrl");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
          Produtos ({products?.length || 0})
        </h2>
        <button onClick={openNew} className="btn-primary">
          <Plus size={14} /> Novo Produto
        </button>
      </div>

      {/* Products table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--brand-sand)" }}>
              {["Produto", "Categoria", "Preço", "Estoque", "Entrega", "Status", "Stripe", ""].map(h => (
                <th key={h} className="text-left py-3 px-3 text-xs tracking-widest uppercase font-medium"
                  style={{ color: "var(--brand-terracota)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products?.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid var(--brand-sand)" }}>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt="" className="w-10 h-10 object-cover flex-shrink-0"
                        style={{ border: "1px solid var(--brand-sand)" }} />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "var(--brand-sand)" }}>
                        <Package size={16} style={{ color: "var(--brand-marrom)" }} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{p.name}</p>
                      {p.isFeatured && (
                        <span className="text-xs flex items-center gap-1" style={{ color: "var(--brand-terracota)" }}>
                          <Star size={10} fill="currentColor" /> Destaque
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: "var(--brand-marrom)" }}>{p.category}</td>
                <td className="py-3 px-3 font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                  {formatPrice(p.priceInCents)}
                  {p.compareAtPriceInCents && (
                    <p className="text-xs line-through" style={{ color: "rgba(92,64,51,0.4)" }}>
                      {formatPrice(p.compareAtPriceInCents)}
                    </p>
                  )}
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: "var(--brand-marrom)" }}>
                  {p.stock === null ? "∞" : p.stock}
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: "var(--brand-marrom)" }}>{p.deliveryType}</td>
                <td className="py-3 px-3">
                  <span className="text-xs px-2 py-1"
                    style={{
                      backgroundColor: p.isActive ? "#D1FAE5" : "#FEE2E2",
                      color: p.isActive ? "#065F46" : "#991B1B",
                    }}>
                    {p.isActive ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="py-3 px-3">
                  {p.stripeProductId ? (
                    <span className="text-xs px-2 py-1" style={{ backgroundColor: "#EDE9FE", color: "#5B21B6" }}>
                      ✓ Sync
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: "rgba(92,64,51,0.4)" }}>—</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p as any)}
                      className="p-1.5 transition-opacity hover:opacity-70"
                      style={{ color: "var(--brand-marrom)" }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => { if (confirm("Remover produto?")) del.mutate({ id: p.id }); }}
                      className="p-1.5 transition-opacity hover:opacity-70"
                      style={{ color: "#DC2626" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <div className="text-center py-12">
            <ShoppingBag size={32} className="mx-auto mb-3" style={{ color: "var(--brand-sand)" }} />
            <p className="text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Nenhum produto cadastrado. Crie o primeiro!
            </p>
          </div>
        )}
      </div>

      {/* Form modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-8"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-2xl p-8 mb-8" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                {(editing as any).id ? "Editar Produto" : "Novo Produto"}
              </h2>
              <button onClick={() => setEditing(null)} className="bg-transparent border-none cursor-pointer"
                style={{ color: "var(--brand-marrom)" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input type="hidden" {...register("id")} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nome *</label>
                  <input {...register("name", { required: true })} className="form-input" placeholder="Ensaio Sensorial" />
                </div>
                <div>
                  <label className="form-label">Slug</label>
                  <input {...register("slug")} className="form-input" placeholder="ensaio-sensorial (auto)" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Categoria *</label>
                  <select {...register("category", { required: true })} className="form-input">
                    <option value="ensaio">Ensaio</option>
                    <option value="obra_arte">Obra de Arte</option>
                    <option value="ceramica">Cerâmica</option>
                    <option value="print">Print</option>
                    <option value="mentoria">Mentoria</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Tipo de Entrega *</label>
                  <select {...register("deliveryType", { required: true })} className="form-input">
                    <option value="agendamento">Agendamento</option>
                    <option value="envio_fisico">Envio Físico</option>
                    <option value="download">Download Digital</option>
                    <option value="acesso_online">Acesso Online</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Preço (em centavos) *</label>
                  <input {...register("priceInCents", { required: true })} type="number" className="form-input" placeholder="35000 = R$ 350,00" />
                </div>
                <div>
                  <label className="form-label">Preço Original (riscado)</label>
                  <input {...register("compareAtPriceInCents")} type="number" className="form-input" placeholder="50000 = R$ 500,00" />
                </div>
              </div>

              <div>
                <label className="form-label">Descrição Curta (máx. 300 chars)</label>
                <input {...register("shortDescription")} className="form-input" placeholder="Uma frase que resume o produto..." />
              </div>

              <div>
                <label className="form-label">Descrição Completa</label>
                <textarea {...register("description")} className="form-input min-h-[80px] resize-none" />
              </div>

              <div>
                <label className="form-label">Imagem Principal</label>
                <MediaUploader
                  value={imageUrl}
                  onChange={(url) => setValue("imageUrl", url)}
                />
                <input type="hidden" {...register("imageUrl")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Estoque (vazio = ilimitado)</label>
                  <input {...register("stock")} type="number" className="form-input" placeholder="Deixe vazio para ilimitado" />
                </div>
                <div>
                  <label className="form-label">Ordem de exibição</label>
                  <input {...register("order")} type="number" className="form-input" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="form-label">Link de Compra Direto</label>
                <input {...register("buyUrl")} className="form-input" placeholder="https://... (WhatsApp, link externo, etc.)" />
                <p className="text-xs mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>Se preenchido, o botão "Comprar" abre este link direto. Deixe vazio para usar checkout Stripe.</p>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm"
                  style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" {...register("isActive")} className="w-4 h-4" />
                  Produto ativo
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm"
                  style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  <input type="checkbox" {...register("isFeatured")} className="w-4 h-4" />
                  Em destaque
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={upsert.isPending}
                  className="btn-primary flex-1">
                  {upsert.isPending ? "Salvando..." : "Salvar Produto"}
                </button>
                <button type="button" onClick={() => setEditing(null)}
                  className="px-6 py-2.5 text-sm border"
                  style={{ borderColor: "var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Orders Admin ─────────────────────────────────────────────────────────────
function OrdersAdmin() {
  const { data: orders, refetch } = trpc.shop.adminListOrders.useQuery();
  const { data: stats } = trpc.shop.getOrderStats.useQuery();
  const updateStatus = trpc.shop.updateOrderStatus.useMutation({
    onSuccess: () => { refetch(); toast.success("Status atualizado!"); },
  });

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const openEditOrder = (order: Order) => {
    setEditingOrder(order);
    setTrackingCode(order.trackingCode || "");
    setAdminNotes(order.adminNotes || "");
    setNewStatus(order.status);
  };

  const saveOrderUpdate = () => {
    if (!editingOrder) return;
    updateStatus.mutate({
      id: editingOrder.id,
      status: newStatus as any,
      trackingCode: trackingCode || undefined,
      adminNotes: adminNotes || undefined,
    });
    setEditingOrder(null);
  };

  const totalRevenue = stats?.totalRevenueInCents || 0;
  const paidCount = stats?.byStatus?.paid?.count || 0;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Receita Total", value: formatPrice(totalRevenue), icon: TrendingUp },
          { label: "Pedidos Pagos", value: String(paidCount), icon: Check },
          { label: "Aguardando", value: String(stats?.byStatus?.pending?.count || 0), icon: ShoppingBag },
          { label: "Enviados", value: String(stats?.byStatus?.shipped?.count || 0), icon: Truck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="p-4"
            style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color: "var(--brand-terracota)" }} />
              <span className="text-xs tracking-widest uppercase"
                style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>{label}</span>
            </div>
            <p className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-2xl font-medium mb-6" style={{ color: "var(--brand-marrom-deep)" }}>
        Pedidos ({orders?.length || 0})
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--brand-sand)" }}>
              {["#", "Cliente", "Produto", "Valor", "Entrega", "Status", "Data", ""].map(h => (
                <th key={h} className="text-left py-3 px-3 text-xs tracking-widest uppercase font-medium"
                  style={{ color: "var(--brand-terracota)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders?.map(order => {
              const statusInfo = STATUS_LABELS[order.status] || { label: order.status, color: "#374151", bg: "#F3F4F6" };
              return (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--brand-sand)" }}>
                  <td className="py-3 px-3 text-xs" style={{ color: "rgba(92,64,51,0.5)" }}>#{order.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{order.customerName || "—"}</p>
                    <p className="text-xs" style={{ color: "rgba(92,64,51,0.6)" }}>{order.customerEmail}</p>
                  </td>
                  <td className="py-3 px-3" style={{ color: "var(--brand-marrom)" }}>{order.productName}</td>
                  <td className="py-3 px-3 font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                    {formatPrice(order.amountInCents)}
                  </td>
                  <td className="py-3 px-3 text-xs" style={{ color: "var(--brand-marrom)" }}>
                    {order.deliveryType || "—"}
                    {order.trackingCode && (
                      <p className="text-xs font-mono" style={{ color: "var(--brand-terracota)" }}>
                        {order.trackingCode}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs px-2 py-1"
                      style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs" style={{ color: "rgba(92,64,51,0.5)" }}>
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 px-3">
                    <button onClick={() => openEditOrder(order as any)}
                      className="p-1.5 transition-opacity hover:opacity-70"
                      style={{ color: "var(--brand-marrom)" }}>
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!orders || orders.length === 0) && (
          <div className="text-center py-12">
            <Package size={32} className="mx-auto mb-3" style={{ color: "var(--brand-sand)" }} />
            <p className="text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Nenhum pedido ainda.
            </p>
          </div>
        )}
      </div>

      {/* Edit order modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(76,48,34,0.7)" }}>
          <div className="w-full max-w-md p-6" style={{ backgroundColor: "var(--brand-bege-light)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                Pedido #{editingOrder.id}
              </h3>
              <button onClick={() => setEditingOrder(null)} className="bg-transparent border-none cursor-pointer"
                style={{ color: "var(--brand-marrom)" }}>
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="form-label">Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="form-input">
                  {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Código de Rastreio</label>
                <input value={trackingCode} onChange={e => setTrackingCode(e.target.value)}
                  className="form-input" placeholder="BR123456789BR" />
              </div>
              <div>
                <label className="form-label">Notas Internas</label>
                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                  className="form-input min-h-[60px] resize-none" placeholder="Observações internas..." />
              </div>
              <div className="flex gap-3">
                <button onClick={saveOrderUpdate} disabled={updateStatus.isPending}
                  className="btn-primary flex-1">
                  {updateStatus.isPending ? "Salvando..." : "Salvar"}
                </button>
                <button onClick={() => setEditingOrder(null)}
                  className="px-4 py-2.5 text-sm border"
                  style={{ borderColor: "var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Shop Component ────────────────────────────────────────────────
export function AdminShop() {
  const [tab, setTab] = useState<"products" | "orders">("products");

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium mb-6" style={{ color: "var(--brand-marrom-deep)" }}>
        Loja
      </h1>

      {/* Tabs */}
      <div className="flex gap-0 mb-8" style={{ borderBottom: "2px solid var(--brand-sand)" }}>
        {[
          { id: "products", label: "Produtos", icon: Package },
          { id: "orders", label: "Pedidos", icon: ShoppingBag },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className="flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-0.5 transition-all"
            style={{
              borderBottomColor: tab === id ? "var(--brand-terracota)" : "transparent",
              color: tab === id ? "var(--brand-terracota)" : "var(--brand-marrom)",
              fontFamily: "'Inter', sans-serif",
            }}>
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === "products" ? <ProductsAdmin /> : <OrdersAdmin />}
    </div>
  );
}
