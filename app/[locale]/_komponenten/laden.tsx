// Wartezeit überbrücken: Stimmen sammeln sich zu einer Karte (gleiche Animation wie in der App).
import { Denkt } from "../ich/[code]/app";
import styles from "./laden.module.css";

export function Laden({ text }: { text: string }) {
  return (
    <main className="seite">
      <div className={styles.laden}>
        <Denkt text={text} />
      </div>
    </main>
  );
}
