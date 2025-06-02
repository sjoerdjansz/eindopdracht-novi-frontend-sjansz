import styles from "./CardParts.module.css";

export function CardContent({ children }) {
  return <div className={styles.content}>{children}</div>;
}
