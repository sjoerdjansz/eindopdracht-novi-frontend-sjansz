import styles from "./CardParts.module.css";

export function CardHeader({ children }) {
  return <div className={styles.header}>{children}</div>;
}
