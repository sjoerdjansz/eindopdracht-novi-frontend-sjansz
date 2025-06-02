import styles from "./CardParts.module.css";

export function CardFooter({ children }) {
  return <div className={styles.footer}>{children}</div>;
}
