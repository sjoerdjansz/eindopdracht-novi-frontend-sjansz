import styles from "./Card.module.css";

// Card component moet zelfde stijl hebben maar inhoud moet alleen verschillen.
export function Card({ variant, size, children }) {
  return (
    <article className={`${styles.card} ${styles[variant]} ${styles[size]}`}>
      {children}
    </article>
  );
}
