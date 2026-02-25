import { useEffect, useRef, useState } from "react";

interface BrushStrokeProps {
  className?: string;
  color?: string;
  opacity?: number;
  delay?: number;
  width?: number;
  height?: number;
  variant?: 1 | 2 | 3 | 4 | 5;
}

const paths: Record<number, string> = {
  1: "M10,50 C30,20 70,80 120,45 C160,15 200,70 240,40 C270,20 290,60 310,50",
  2: "M5,60 Q50,10 100,55 Q150,100 200,50 Q250,5 300,55",
  3: "M0,40 C40,10 80,80 130,35 C170,5 210,75 260,30 C290,10 310,55 320,45",
  4: "M15,55 C45,25 85,75 125,40 C165,10 205,65 245,35 C275,15 295,55 315,48",
  5: "M8,48 Q60,5 110,52 Q160,98 210,48 Q260,2 310,50 Q330,65 340,55",
};

export function BrushStroke({
  className = "",
  color = "#8B6F47",
  opacity = 0.15,
  delay = 500,
  width = 320,
  height = 80,
  variant = 1,
}: BrushStrokeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={`${className} transition-opacity duration-[2000ms] ease-in-out`}
      style={{ opacity: visible ? opacity : 0 }}
      aria-hidden="true"
    >
      <path
        d={paths[variant]}
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          filter: "blur(2px)",
        }}
      />
      <path
        d={paths[variant]}
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

// Corner brushstroke decoration
export function BrushCorner({
  position = "tl",
  color = "#8B6F47",
  delay = 800,
  size = 180,
}: {
  position?: "tl" | "tr" | "bl" | "br";
  color?: string;
  delay?: number;
  size?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const rotations = { tl: 0, tr: 90, br: 180, bl: 270 };
  const positions = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  };

  return (
    <div
      className={`absolute ${positions[position]} pointer-events-none transition-opacity duration-[2000ms] ease-in-out`}
      style={{ opacity: visible ? 0.12 : 0, zIndex: 0 }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 180 180"
        fill="none"
        style={{ transform: `rotate(${rotations[position]}deg)` }}
      >
        <path
          d="M10,170 C10,80 80,10 170,10"
          stroke={color}
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
          style={{ filter: "blur(3px)" }}
        />
        <path
          d="M10,170 C10,80 80,10 170,10"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M30,170 C30,100 100,30 170,30"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
          style={{ filter: "blur(1px)" }}
        />
      </svg>
    </div>
  );
}
