import styles from "./InputField.module.css";

export function InputField({
  label,
  id,
  name,
  type,
  value,
  placeholder,
  handleChange,
  icon = null,
  toggleHandler,
}) {
  return (
    <div className={styles["input-container"]}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={styles["input-wrapper"]}>
        <input
          className={`${styles["input-field"]}`}
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {icon && (
          <button
            onClick={toggleHandler}
            type="button"
            className={styles["input-field-icon"]}
          >
            {icon}
          </button>
        )}
      </div>
    </div>
  );
}
