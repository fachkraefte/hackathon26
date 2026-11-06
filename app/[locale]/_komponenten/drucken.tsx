"use client";

export function Drucken({ text, className }: { text: string; className?: string }) {
  return (
    <button type="button" className={className ?? "button"} onClick={() => window.print()}>
      {text}
    </button>
  );
}
