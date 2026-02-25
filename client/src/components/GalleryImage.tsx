import { useState, useRef, useEffect } from "react";

interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Drop-in replacement for <img> in galleries.
 * Fades in smoothly once the image has loaded, with a subtle scale-in effect.
 * Uses IntersectionObserver so off-screen images only start loading when visible.
 */
export function GalleryImage({ src, alt, className = "", style, onClick }: GalleryImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If image is already cached (complete), mark as loaded immediately
  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onClick={onClick}
      className={`gallery-img ${loaded ? "loaded" : ""} ${className}`}
      style={style}
    />
  );
}
