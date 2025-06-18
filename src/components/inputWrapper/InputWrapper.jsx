import styles from "./InputWrapper.module.css";

export function InputWrapper({ direction, children, width }) {
  return (
    <div
      className={`${styles["input-wrapper"]} ${styles[direction]} ${styles[width]}`}
    >
      {children}
    </div>
  );
}
