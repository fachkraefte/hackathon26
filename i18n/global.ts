import messages from "../messages/en.json";
import { routing } from "./routing";

declare module "use-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
