import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  delay?: number;          // initial delay in ms before starting
  charDelay?: number;      // ms per character
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({ text, delay = 500, charDelay = 120, className = "", onComplete }: TypewriterProps) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed([]);
    setStarted(false);
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      onComplete?.();
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(prev => [...prev, text[prev.length]]);
    }, charDelay);
    return () => clearTimeout(t);
  }, [started, displayed, text, charDelay, onComplete]);

  return (
    <span className={className}>
      {displayed.map((char, i) => (
        <span
          key={i}
          className="tw-char"
          style={{ animationDelay: `0ms`, animationDuration: `${charDelay * 0.8}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-[1em] bg-current opacity-70 animate-pulse ml-0.5" />
      )}
    </span>
  );
}

interface TypewriterLineProps {
  lines: string[];
  delay?: number;
  charDelay?: number;
  lineGap?: number;        // extra delay between lines in ms
  className?: string;
  lineClassName?: string;
}

export function TypewriterLines({ lines, delay = 500, charDelay = 100, lineGap = 300, className = "", lineClassName = "" }: TypewriterLineProps) {
  const [currentLine, setCurrentLine] = useState(-1);
  const [completedLines, setCompletedLines] = useState<number[]>([]);

  useEffect(() => {
    setCurrentLine(-1);
    setCompletedLines([]);
    const t = setTimeout(() => setCurrentLine(0), delay);
    return () => clearTimeout(t);
  }, [lines.join("|"), delay]);

  const handleLineComplete = (idx: number) => {
    setCompletedLines(prev => [...prev, idx]);
    setTimeout(() => {
      if (idx + 1 < lines.length) setCurrentLine(idx + 1);
    }, lineGap);
  };

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={i} className={lineClassName}>
          {i < currentLine || completedLines.includes(i) ? (
            <span>{line}</span>
          ) : i === currentLine ? (
            <Typewriter
              text={line}
              delay={0}
              charDelay={charDelay}
              onComplete={() => handleLineComplete(i)}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
