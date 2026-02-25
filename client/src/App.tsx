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
import { ScrollToTop } from "./components/ScrollToTop";

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
      <Route path="/sobre" component={Sobre} />
      <Route path="/mentorias" component={Mentorias} />
      <Route path="/contato" component={Contato} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/:section" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
