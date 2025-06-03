import styles from "./CustomCheckbox.module.css";

export function CustomCheckbox({ selected, onClick }) {
  return (
    //  Wellicht beter om hier een checkbox van te maken. Button was sneller stylen.
    <button
      onClick={onClick}
      className={`${styles["custom-checkbox"]} ${selected && styles.selected}`}
    ></button>
  );
}
