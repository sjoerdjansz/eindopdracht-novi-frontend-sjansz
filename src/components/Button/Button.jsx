import styles from "./Button.module.css";

export function Button({ type, label, buttonSize, buttonType }) {
  return (
    <button
      className={`${styles.button} ${styles[buttonSize]} ${styles[buttonType]}`}
      type={type}
    >
      {label}
    </button>
  );
}
