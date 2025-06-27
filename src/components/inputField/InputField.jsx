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
  style,
  required,
  onFocus,
}) {
  return (
    <>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className={styles["required"]}>*</span>}
        </label>
      )}
      <div className={styles["input-field-container"]}>
        <input
          className={`${styles["input-field"]} ${styles[style]}`}
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={onFocus}
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
    </>
  );
}
