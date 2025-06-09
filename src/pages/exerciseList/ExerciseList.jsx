import styles from "./ExerciseList.module.css";
import { Button } from "../../components/button/Button.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { EXERCISES } from "../../data/exerciseData.js";

export function ExerciseList() {
  return (
    <div className={styles["exercise-list"]}>
      <h1>Exercise List</h1>
      <section className={styles["exercise-list__controls"]}>
        <div className={styles["exercise-list__controls-input-wrapper"]}>
          <Button
            buttonType="primary"
            type="button"
            buttonSize="medium"
            label="create exercise"
          />
        </div>
        <div className={styles["exercise-list__controls-input-wrapper"]}>
          <InputField
            type="text"
            name="filter-bodypart"
            id="filter-bodypart"
            placeholder="Filter bodypart"
            style="primary"
          />
          <InputField
            type="text"
            name="find-exercise"
            id="find-exercise"
            placeholder="Find exercise"
            style="primary"
          />
        </div>
      </section>
      <section className={styles["exercise-list__exercises"]}>
        <table>
          <thead>
            <tr className={styles["exercise-list__header"]}>
              <th>Name</th>
              <th>Bodypart</th>
              <th>Movement</th>
              <th>Primary</th>
              <th>Secondary</th>
            </tr>
          </thead>
          <tbody>
            {EXERCISES.map((exercise) => {
              return (
                <tr key={exercise.id} className={styles["exercise-list__row"]}>
                  <td>{exercise.name}</td>
                  <td>{exercise.bodyPart}</td>
                  <td>{exercise.movement}</td>
                  <td>{exercise.primaryMuscles}</td>
                  <td>{exercise.secondaryMuscles}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
