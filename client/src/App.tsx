import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Obras from "./pages/Obras";
import Sobre from "./pages/Sobre";
import Mentorias from "./pages/Mentorias";
import Contato from "./pages/Contato";
import Fotografia from "./pages/Fotografia";
import Ceramica from "./pages/Ceramica";
import Projetos from "./pages/Projetos";
import Admin from "./pages/Admin";
import AdminFotos from "./pages/AdminFotos";
import Blog, { BlogPost } from "./pages/Blog";
import { ScrollToTop } from "./components/ScrollToTop";
import { NewsletterPopup } from "./components/NewsletterPopup";
import FormOnboarding from "./pages/FormOnboarding";
import FormSatisfacao from "./pages/FormSatisfacao";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Loja from "./pages/Loja";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import PedidoSucesso from "./pages/PedidoSucesso";
import EnsaioGestante from "./pages/EnsaioGestante";
import EnsaioFeminino from "./pages/EnsaioFeminino";
import EnsaioProfissional from "./pages/EnsaioProfissional";
import ClienteVip from "./pages/ClienteVip";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/portfolio/:category" component={Portfolio} />
      <Route path="/obras" component={Obras} />
      <Route path="/obras/:slug" component={Obras} />
      <Route path="/fotografia" component={Fotografia} />
      <Route path="/fotografia/:slug" component={Fotografia} />
      <Route path="/ceramica" component={Ceramica} />
      <Route path="/projetos" component={Projetos} />
      <Route path="/projetos/:slug" component={Projetos} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug">{(params) => <BlogPost slug={params.slug ?? ""} />}</Route>
      <Route path="/sobre" component={Sobre} />
      <Route path="/mentorias" component={Mentorias} />
      <Route path="/contato" component={Contato} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/fotos" component={AdminFotos} />
      <Route path="/admin-fotos" component={AdminFotos} />
      <Route path="/admin/:section" component={Admin} />
      <Route path="/onboarding/:token" component={FormOnboarding} />
      <Route path="/satisfacao/:token" component={FormSatisfacao} />
      <Route path="/privacidade" component={Privacidade} />
      <Route path="/termos" component={Termos} />
      <Route path="/loja" component={Loja} />
      <Route path="/loja/sucesso" component={PedidoSucesso} />
      <Route path="/loja/:slug" component={ProdutoDetalhe} />
      <Route path="/ensaio-gestante" component={EnsaioGestante} />
      <Route path="/ensaio-feminino" component={EnsaioFeminino} />
      <Route path="/ensaio-profissional" component={EnsaioProfissional} />
      <Route path="/cliente-vip" component={ClienteVip} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function FloatingBookingButton() {
  return (
    <a
      href="https://vendasdemo-35ftt8sk.manus.space"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-4 sm:left-auto sm:right-6 z-50 flex items-center gap-2 bg-[#8B4513] hover:bg-[#6B3410] text-[#F5F0E8] text-xs font-semibold tracking-widest uppercase px-5 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      style={{ letterSpacing: '0.12em' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      Agendar Ensaio
    </a>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
          <ScrollToTop />
          <NewsletterPopup />
          <FloatingBookingButton />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
