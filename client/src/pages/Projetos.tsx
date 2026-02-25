import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Link, useParams } from "wouter";
import { ArrowLeft, X } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";

const PROJECTS_FALLBACK = [
  { id: 1, title: "Exposição Coletiva — Corpo e Memória", slug: "corpo-e-memoria", type: "exposicao", description: "Participação em exposição coletiva sobre corpo e memória com obras da série Fio.", coverImageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80&auto=format&fit=crop", date: "2024", location: "São Paulo, SP", isFeatured: true },
  { id: 2, title: "Colaboração — Moda Autoral", slug: "moda-autoral", type: "colaboracao", description: "Ensaio fotográfico em colaboração com designer de moda autoral brasileira.", coverImageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format&fit=crop", date: "2024", location: "São Paulo, SP", isFeatured: false },
  { id: 3, title: "Projeto Especial — Ancestralidade", slug: "ancestralidade", type: "trabalho_unico", description: "Série fotográfica sobre ancestralidade e identidade, desenvolvida ao longo de 6 meses.", coverImageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80&auto=format&fit=crop", date: "2023", location: "Brasil", isFeatured: true },
];

const TYPE_LABELS: Record<string, string> = {
  colaboracao: "Colaboração",
  exposicao: "Exposição",
  trabalho_unico: "Trabalho Único",
  outro: "Projeto",
};

export default function Projetos() {
  const params = useParams<{ slug?: string }>();
  const [visible, setVisible] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const { data: projectsData } = trpc.specialProjects.getAll.useQuery();
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const projects = (projectsData && projectsData.length > 0) ? projectsData : PROJECTS_FALLBACK;

  if (params.slug) {
    const project = projects.find(p => p.slug === params.slug) || projects[0];
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <Navigation />
        {lightboxSrc && (
          <div className="lightbox-backdrop" onClick={() => setLightboxSrc(null)}>
            <button className="absolute top-6 right-6 text-white bg-transparent border-none cursor-pointer z-10" onClick={() => setLightboxSrc(null)}>
              <X size={28} />
            </button>
            <img src={lightboxSrc} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
          </div>
        )}
        <div className="pt-24 pb-20">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <Link href="/projetos" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase no-underline mb-10 opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              <ArrowLeft size={14} /> Projetos Especiais
            </Link>
            <div className={`transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <span className="section-eyebrow block mb-3">{TYPE_LABELS[project.type || "outro"]}</span>
              <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>{project.title}</h1>
              <div className="divider-terracota mb-8" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="img-hover cursor-pointer" style={{ border: "1px solid var(--brand-sand)" }} onClick={() => setLightboxSrc(project.coverImageUrl || "")}>
                  <img src={project.coverImageUrl || ""} alt={project.title} className="w-full" />
                  <div className="img-hover-overlay" />
                </div>
                <div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{project.description}</p>
                  <div className="grid grid-cols-2 gap-4 p-5" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                    {[{ label: "Ano", value: project.date }, { label: "Local", value: project.location }].map(({ label, value }) => value ? (
                      <div key={label}>
                        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>{label}</p>
                        <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{value}</p>
                      </div>
                    ) : null)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className={`mb-16 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-3">Projetos Especiais</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>
              Colaborações & Exposições
            </h1>
            <div className="divider-terracota" />
            <p className="mt-6 text-sm leading-relaxed max-w-2xl" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Trabalhos únicos, colaborações artísticas e participações em exposições que expandem os limites da fotografia como arte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p, i) => (
              <Link key={p.id} href={`/projetos/${p.slug}`}
                className={`group block no-underline transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${200 + i * 120}ms` }}>
                <div className="img-hover aspect-[4/3] mb-4" style={{ border: "1px solid var(--brand-sand)" }}>
                  <img src={p.coverImageUrl || ""} alt={p.title} style={{ filter: "grayscale(15%)" }} />
                  <div className="img-hover-overlay" />
                </div>
                <span className="text-xs tracking-widest uppercase mb-2 block" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                  {TYPE_LABELS[p.type || "outro"]} · {p.date}
                </span>
                <h2 className="font-serif text-xl font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>{p.title}</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{p.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
