import styles from "./WorkoutBuilder.module.css";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";

import { useState } from "react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faGripVertical } from "@fortawesome/free-solid-svg-icons";

// Data
import { SELECTED_EXERCISES } from "../../data/exerciseData.js";

export function WorkoutBuilder() {
  const [exercises, setExercises] = useState(SELECTED_EXERCISES);

  // de start van de drag - item wordt opgepakt
  function handleDragStart(e, order) {
    e.dataTransfer.setData("text/plain", order);
    e.dataTransfer.effectAllowed = "move";

    //pakt met de closest property het dichtsbijzinde html element
    const row = e.target.closest("tr");
    // als waar dan voert hij de volgende berekeningen uit:
    if (row) {
      //ingebouwde method die een vierkantje om het geselecteerde element maakt
      const rect = row.getBoundingClientRect();
      // bepaalde op basis van het event de coordinaten op de X en Y as van de muis
      // haalt daar de rechter en linker spacing/coordinaten van de bounding box af om het geselecteerde
      // element direct onder de cursor te krijgen
      const offsetX = e.clientX - rect.left; // horizontaal
      const offsetY = e.clientY - rect.top; // verticaal
      // met de ingebouwde methode een drag image meegeven (img of bij html elementen, whatever je wil),
      // die krijgt de coordinaten en het element mee
      e.dataTransfer.setDragImage(row, offsetX, offsetY);
    }
    // console.log(e);
  }

  // 1. Render de exercises op random volgorde op de pagina
  // 2. Geef de id van exercise item mee aan de dragStart functie via setData
  // 3. Pik die weer op met de dragDrop door die op te vangen in een var via getData

  // is ook nodig want anders wordt de onDrop nooit getriggerd
  function handleDragOver(e) {
    e.preventDefault();
    // console.log("Firing drag OVER");
    // console.log(e);
  }

  // nodig voor de drop functionaliteit en wat er na de drop qua logica gedaan moet worden
  function handleDrop(e, id) {
    e.preventDefault();

    const draggedItemNumber = e.dataTransfer.getData("text/plain");
    const dropItemNumber = id;

    //Logica van array rangschikking

    // copy van de array welke volgens react goed is (arrCopy = exercises) mag niet omdat het een
    // verwijzing naar dezelde array uit state is.
    let arrCopy = [...exercises];

    // verificatie van de id en positie van de dragged item
    const originalItemPosition = arrCopy.findIndex((exercise) => {
      return exercise.id === draggedItemNumber;
    });

    // verificatie van de id en positie van de dropped item
    const newItemPosition = arrCopy.findIndex((exercise) => {
      return exercise.id === dropItemNumber;
    });

    // het verplaatste item
    const draggedItem = arrCopy.splice(originalItemPosition, 1);

    arrCopy.splice(newItemPosition, 0, draggedItem[0]);

    setExercises(arrCopy);
    console.log(exercises);
  }

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
            {exercises.map((exercise) => {
              return (
                <tr
                  key={exercise.id}
                  className={styles["draggable"]}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, exercise.id)}
                >
                  <td
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, exercise.id)}
                    className={`${styles["table-align-center"]} ${styles["drag-icon"]}`}
                  >
                    <div className={styles["table-icon-wrapper"]}>
                      <FontAwesomeIcon icon={faGripVertical} />
                    </div>
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
                      <div className={styles["table-controls__delete"]}>
                        <div className={styles["table-icon-wrapper"]}>
                          <FontAwesomeIcon icon={faBan} />
                        </div>
                      </div>
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
