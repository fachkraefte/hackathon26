// Erlaubt CSS-Variablen im style-Attribut, z. B. style={{ "--art": "…" }}.
import "react";

declare module "react" {
  interface CSSProperties {
    [variable: `--${string}`]: string | number | undefined;
  }
}
