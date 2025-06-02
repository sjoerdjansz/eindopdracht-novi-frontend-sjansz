import styles from "./CustomCheckbox.module.css";

export function CustomCheckbox({ onClick, selected }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`${styles["custom-checkbox"]} ${!selected ? styles.selected : ""}`}
    ></button>
  );
}
