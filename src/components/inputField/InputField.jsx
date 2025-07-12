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
  togglePasswordValidation,
  tooltip,
}) {
  function getValidPasswordStyle(bool, inputName) {
    if (inputName === "password") {
      if (bool === null) {
        return "";
      } else if (bool) {
        return styles["password-invalid"];
      } else {
        return styles["password-valid"];
      }
    } else {
      return "";
    }
  }

  return (
    <>
      {label && (
        <label htmlFor={id} className={styles["input-field-label"]}>
          {label}
          {required && <span className={styles["required"]}>*</span>}
          {tooltip && tooltip}
        </label>
      )}
      <div className={styles["input-field-container"]}>
        <input
          className={`${styles["input-field"]} 
    ${style ? styles[style] : ""} 
    ${getValidPasswordStyle(togglePasswordValidation, name)}`}
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={onFocus}
          autoComplete="off"
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
