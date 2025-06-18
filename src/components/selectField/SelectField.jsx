import styles from "./SelectField.module.css";
import { Button } from "../button/Button.jsx";
export function SelectField({
  options,
  label,
  id,
  name,
  styling,
  title,
  required,
  button,
  buttonLabel,
  value,
  handleChange,
  onAddMuscleClick,
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
          {options.map((option) => {
            return (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            );
          })}
        </select>
        {button && (
          <Button
            type="button"
            label={buttonLabel}
            buttonSize="small"
            buttonType="primary"
            handleClick={onAddMuscleClick}
          />
        )}
      </div>
    </>
  );
}
