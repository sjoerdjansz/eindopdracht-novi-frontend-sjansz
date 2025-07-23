import styles from "./ExerciseResultRow.module.css";
import { InputField } from "../inputField/InputField.jsx";
import { Checkbox } from "../checkbox/Checkbox.jsx";

export function ExerciseResultRow({ index, lastResult, reps, weight }) {
  return (
    <>
      <div className={styles["set-number"]}>S{index + 1}</div>
      <div className={styles["last-result"]}>
        {lastResult ? lastResult : "No previous data"}
      </div>
      <InputField
        type="number"
        name="reps"
        id="reps"
        className={styles["reps-input"]}
      ></InputField>
      <span className={styles["multiply-symbol"]}>x</span>
      <InputField type="number" className={styles["weight-input"]}></InputField>
      <div className={styles["checkbox-container"]}>
        <Checkbox />
      </div>
    </>
  );
}
