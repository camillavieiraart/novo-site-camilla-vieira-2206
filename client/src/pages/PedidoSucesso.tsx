import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { CheckCircle, ArrowRight, ShoppingBag, Mail } from "lucide-react";

export default function PedidoSucesso() {
  useSEO({
    title: "Pedido Confirmado",
    description: "Seu pedido foi confirmado com sucesso. Em breve você receberá um e-mail com os detalhes do seu ensaio fotográfico.",
    keywords: "pedido confirmado, ensaio fotográfico agendado, Camilla Vieira",
    canonical: "/loja/sucesso",
  });

  const [location] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    setSessionId(sid);
    setTimeout(() => setVisible(true), 300);
  }, []);

  const { data: order } = trpc.shop.getOrderStatus.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId, refetchInterval: 3000, refetchIntervalInBackground: false }
  );

  const isPaid = order?.status === "paid" || order?.status === "processing" || order?.status === "shipped" || order?.status === "delivered";

  const deliveryMessages: Record<string, string> = {
    agendamento: "Em breve você receberá um e-mail com o link para agendar sua sessão com Camilla.",
    envio_fisico: "Sua peça será embalada com cuidado e enviada pelos Correios em até 3 dias úteis.",
    download: "Você receberá um link de download no e-mail cadastrado em instantes.",
    acesso_online: "Você terá acesso ao conteúdo online em instantes. Verifique seu e-mail.",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#D1FAE5" }}>
                <CheckCircle size={40} style={{ color: "#059669" }} />
              </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4"
              style={{ color: "var(--brand-marrom-deep)" }}>
              {isPaid ? "Pedido Confirmado!" : "Processando..."}
            </h1>

            <div className="mb-6 mx-auto" style={{ width: "48px", height: "1px", backgroundColor: "var(--brand-sand)" }} />

            {/* Status */}
            {order ? (
              <div className="mb-8 p-6" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs tracking-widest uppercase"
                    style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                    Produto
                  </span>
                  <span className="font-serif text-lg font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                    {order.productName}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs tracking-widest uppercase"
                    style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                    Valor
                  </span>
                  <span className="font-serif text-lg font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.amountInCents / 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-widest uppercase"
                    style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                    Status
                  </span>
                  <span className="text-sm font-medium px-3 py-1"
                    style={{
                      backgroundColor: isPaid ? "#D1FAE5" : "#FEF3C7",
                      color: isPaid ? "#065F46" : "#92400E",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                    {isPaid ? "✓ Pago" : "⏳ Aguardando confirmação"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-8 flex justify-center">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "var(--brand-terracota)" }} />
              </div>
            )}

            {/* Delivery message */}
            {order?.deliveryType && deliveryMessages[order.deliveryType] && (
              <div className="mb-8 p-4 text-left"
                style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                <div className="flex items-start gap-3">
                  <Mail size={16} style={{ color: "#1D4ED8", flexShrink: 0, marginTop: "2px" }} />
                  <p className="text-sm" style={{ color: "#1E40AF", fontFamily: "'Inter', sans-serif" }}>
                    {deliveryMessages[order.deliveryType]}
                  </p>
                </div>
              </div>
            )}

            {/* Generic message if no order yet */}
            {!order && (
              <p className="text-sm leading-relaxed mb-8"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Seu pagamento está sendo processado. Você receberá um e-mail de confirmação em breve.
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/loja"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium no-underline"
                style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                <ShoppingBag size={14} /> Continuar comprando
              </Link>
              <Link href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium no-underline border"
                style={{ borderColor: "var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Voltar ao início <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
