import styles from "./SelectField.module.css";
import { Button } from "../button/Button.jsx";
export function SelectField({
  options,
  label,
  id,
  name,
  styling,
  buttonStyle,
  title,
  required,
  button,
  buttonLabel,
  value,
  handleChange,
  onButtonClick,
}) {
  return (
    <>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className={styles["required"]}>*</span>}{" "}
        </label>
      )}
      <div className={styles["select-wrapper"]}>
        <select
          className={styles[styling]}
          id={id}
          name={name}
          onChange={handleChange}
          value={value}
        >
          <option value="" disabled>
            {title}
          </option>
          {options &&
            options
              .sort((a, b) => {
                if (a.value) {
                  return a.value.localeCompare(b.value);
                } else {
                  return a.localeCompare(b);
                }
              })
              .map((option) => {
                return (
                  <option
                    key={option.value || option}
                    value={option.value ? option.value.trim() : option.trim()}
                  >
                    {option.label || option}
                  </option>
                );
              })}
        </select>
        {button && (
          <Button
            type="button"
            label={buttonLabel}
            buttonSize="small"
            buttonType={buttonStyle}
            handleClick={onButtonClick}
          />
        )}
      </div>
    </>
  );
}
