import styles from "./Button.module.css";

export function Button({
  type,
  label,
  buttonSize,
  buttonType,
  handleClick,
  disabled,
}) {
  return (
    <button
      className={`${styles.button} ${styles[buttonSize]} ${styles[buttonType]} ${disabled && styles["disabled"]}`}
      type={type}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
