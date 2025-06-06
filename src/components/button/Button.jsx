import styles from "./Button.module.css";

export function Button({ type, label, buttonSize, buttonType, handleClick }) {
  return (
    <button
      className={`${styles.button} ${styles[buttonSize]} ${styles[buttonType]}`}
      type={type}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
