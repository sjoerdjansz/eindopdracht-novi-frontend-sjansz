import styles from "./InputField.module.css";

export function InputField({ label, id, name, type, value, onChange, error }) {
  return (
    <div className={styles["input-field"]}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
