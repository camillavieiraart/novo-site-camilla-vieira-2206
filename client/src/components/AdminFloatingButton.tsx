import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Settings } from "lucide-react";

interface AdminFloatingButtonProps {
  href: string;
  label?: string;
}

export default function AdminFloatingButton({ href, label = "Editar" }: AdminFloatingButtonProps) {
  const { user } = useAuth();
  if (!user || user.role !== "admin") return null;
  return (
    <Link
      href={href}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg no-underline transition-all hover:scale-105 active:scale-95"
      style={{
        backgroundColor: "var(--brand-terracota)",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.8rem",
        fontWeight: 500,
        letterSpacing: "0.04em",
      }}
    >
      <Settings size={14} />
      {label}
    </Link>
  );
}
