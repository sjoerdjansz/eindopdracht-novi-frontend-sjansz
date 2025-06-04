import styles from "./WorkoutBuilder.module.css";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faBan } from "@fortawesome/free-solid-svg-icons";

// Data

import { EXERCISES } from "../../data/exerciseData.js";
import { SELECTED_EXERCISES } from "../../data/exerciseData.js";

export function WorkoutBuilder() {
  return (
    <div className={styles["workout-builder"]}>
      <h1>Build Workout</h1>

      {/* Hier werkt de CSS styling van de search controls goed. Input beweegt mee obv de CSS,
      in workouts pagina doet die dit niet goed dus nog aanpassen */}
      <section className={styles["workout-builder__controls"]}>
        <div className={styles["workout-builder__controls-search"]}>
          <div className={styles["workout-builder__controls-input-wrapper"]}>
            <InputField
              type="text"
              name="exercise"
              id="exercise"
              placeholder="Search exercise"
            />
          </div>

          <Button
            buttonType="secondary"
            label="Add"
            type="button"
            buttonSize="small"
          />
        </div>
        <div className={styles["workout-builder__controls-input-wrapper"]}>
          <InputField
            type="text"
            name="name"
            id="name"
            placeholder="Workout name"
          />
        </div>
      </section>
      <section className={styles["workout-builder__exercise-list"]}>
        <table className={styles["workout__table"]}>
          <thead>
            <tr>
              <th className={styles["table-align-left"]}></th>
              <th className={styles["table-align-left"]}>Exercise</th>
              <th className={styles["table-align-center"]}>Sets</th>
              <th className={styles["table-align-center"]}>Reps</th>
              <th className={styles["table-align-center"]}>Rest</th>
              <th className={styles["table-align-center"]}></th>
            </tr>
          </thead>
          <tbody>
            {SELECTED_EXERCISES.map((exercise) => {
              return (
                <tr key={exercise.id} className={styles["draggable"]}>
                  <td
                    className={`${styles["table-align-center"]} ${styles["drag-icon"]}`}
                  >
                    <FontAwesomeIcon icon={faGripVertical} />
                  </td>
                  <td className={styles["table-align-left"]}>
                    {exercise.name}
                  </td>
                  <td className={styles["table-align-center"]}>
                    {exercise.sets}
                  </td>
                  <td className={styles["table-align-center"]}>
                    {exercise.reps}
                  </td>
                  <td className={styles["table-align-center"]}>
                    {exercise.rest}
                  </td>
                  <td className={styles["table-align-center"]}>
                    <div className={styles["table-controls"]}>
                      <span className={styles["table-controls__edit"]}>
                        Edit
                      </span>
                      <span className={styles["table-controls__superset"]}>
                        Superset
                      </span>
                      <span className={styles["table-controls__delete"]}>
                        <FontAwesomeIcon icon={faBan} />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
