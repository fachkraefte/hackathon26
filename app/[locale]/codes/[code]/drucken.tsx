"use client";

export function Drucken({ text }: { text: string }) {
  return (
    <button type="button" className="button" onClick={() => window.print()}>
      {text}
    </button>
  );
}
