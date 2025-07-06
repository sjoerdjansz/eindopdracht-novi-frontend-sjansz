import styles from "./RadioButton.module.css";

export function RadioButton({ id, name, value, checked, handleChange, label }) {
  return (
    <label htmlFor={id} className={styles["radio-option"]}>
      {label}
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
      />
    </label>
  );
}
