import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Upload, X, Film, Image as ImageIcon, Loader2 } from "lucide-react";

type MediaType = "image" | "video" | "any";

interface MediaUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  onClear?: () => void;
  type?: MediaType;
  folder?: string;
  label?: string;
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "video";
}

const ACCEPTED: Record<MediaType, string> = {
  image: "image/jpeg,image/png,image/webp,image/gif",
  video: "video/mp4,video/webm,video/mov,video/quicktime",
  any: "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/mov,video/quicktime",
};

const MAX_SIZE_MB: Record<MediaType, number> = {
  image: 20,
  video: 500,
  any: 500,
};

const ASPECT_CLASSES: Record<string, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-video",
  video: "aspect-video",
};

export default function MediaUploader({
  value,
  onChange,
  onClear,
  type = "image",
  folder = "uploads",
  label,
  className = "",
  aspectRatio = "landscape",
}: MediaUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.upload.uploadBase64.useMutation({
    onSuccess: (data) => {
      onChange(data.url);
      setProgress(0);
      setError(null);
    },
    onError: (err) => {
      setError("Erro ao fazer upload: " + err.message);
      setProgress(0);
    },
  });

  const isVideo = value && (value.includes(".mp4") || value.includes(".webm") || value.includes(".mov") || value.includes("video"));

  const processFile = useCallback(async (file: File) => {
    setError(null);
    const maxMB = MAX_SIZE_MB[type];
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo: ${maxMB}MB`);
      return;
    }

    // Simulate progress while reading
    setProgress(10);
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) setProgress(10 + Math.round((e.loaded / e.total) * 40));
    };
    reader.onload = () => {
      setProgress(50);
      uploadMutation.mutate({
        base64: reader.result as string,
        filename: file.name,
        contentType: file.type,
        folder,
      });
      // Fake progress while uploading
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) { clearInterval(interval); return p; }
          return p + 5;
        });
      }, 200);
    };
    reader.readAsDataURL(file);
  }, [type, folder, uploadMutation]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const isLoading = uploadMutation.isPending;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--brand-marrom)" }}>
          {label}
        </label>
      )}

      {/* Preview area */}
      {value ? (
        <div className={`relative group ${ASPECT_CLASSES[aspectRatio]} rounded overflow-hidden border`}
          style={{ borderColor: "var(--brand-sand)" }}>
          {isVideo ? (
            <video src={value} controls className="w-full h-full object-cover" />
          ) : (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-white"
              style={{ backgroundColor: "var(--brand-marrom)" }}
            >
              <Upload size={12} /> Trocar
            </button>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-white bg-red-600"
              >
                <X size={12} /> Remover
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          className={`${ASPECT_CLASSES[aspectRatio]} rounded border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? "border-[var(--brand-terracota)] bg-[var(--brand-bege)]" : "border-[var(--brand-sand)] hover:border-[var(--brand-marrom)]"}`}
          style={{ backgroundColor: isDragging ? undefined : "var(--brand-bege-light)" }}
          onClick={() => !isLoading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 px-4">
              <Loader2 size={28} className="animate-spin" style={{ color: "var(--brand-marrom)" }} />
              <div className="w-full max-w-[160px]">
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--brand-sand)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, backgroundColor: "var(--brand-terracota)" }}
                  />
                </div>
                <p className="text-xs text-center mt-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  {progress < 50 ? "Lendo arquivo..." : "Enviando..."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              {type === "video" ? (
                <Film size={28} style={{ color: "var(--brand-marrom)", opacity: 0.5 }} />
              ) : (
                <ImageIcon size={28} style={{ color: "var(--brand-marrom)", opacity: 0.5 }} />
              )}
              <p className="text-xs font-medium" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                {isDragging ? "Solte aqui" : "Clique ou arraste"}
              </p>
              <p className="text-xs opacity-50" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                {type === "video" ? "MP4, WebM, MOV • até 500MB" : "JPG, PNG, WebP • até 20MB"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress bar when uploading with existing preview */}
      {isLoading && value && (
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--brand-sand)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: "var(--brand-terracota)" }}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED[type]}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
