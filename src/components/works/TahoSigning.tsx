import styles from "./TahoSigning.module.css";

/* Highlights the signing screen's three blocks in the order people check them. Decorative. */
export function TahoSigning() {
  return (
    <div aria-hidden className={`${styles.overlay} pointer-events-none absolute inset-0`}>
      <span className={`${styles.block} ${styles.what}`} />
      <span className={`${styles.block} ${styles.who}`} />
      <span className={`${styles.block} ${styles.wallet}`} />
    </div>
  );
}
