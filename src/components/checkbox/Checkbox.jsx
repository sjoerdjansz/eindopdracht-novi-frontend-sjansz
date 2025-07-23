import styles from "./Checkbox.module.css";

export function Checkbox() {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" />
      <span className={styles.checkmark}></span>
    </label>
  );
}
