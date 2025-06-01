import styles from "./SelectField.module.css";

export function SelectField({ options, label, id, name, styling }) {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <select className={styles[styling]} id={id} name={name}>
        <option value="" placeholder="--Filter by--">
          --Filter by--
        </option>
        <hr />
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </>
  );
}
