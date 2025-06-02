import styles from "./Workouts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState } from "react";

// Components

import { Button } from "../../components/button/Button.jsx";
import { SelectField } from "../../components/selectField/SelectField.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Card } from "../../components/card/Card.jsx";
import { CardHeader } from "../../components/card/CardHeader.jsx";
import { CardContent } from "../../components/card/CardContent.jsx";
import { CardFooter } from "../../components/card/CardFooter.jsx";

// Data
import { WORKOUTS } from "../../data/workoutData.js";
import { WORKOUT_FILTER_OPTIONS } from "../../data/workoutFilterOptions.js";

// Icons

import {
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { CustomCheckbox } from "../../components/customCheckbox/CustomCheckbox.jsx";

export function Workouts() {
  const [isSelected, setIsSelected] = useState(false);

  function handleClick() {
    setIsSelected(!isSelected);
  }

  return (
    <div className={styles.workouts}>
      <div className={styles["workouts__title-container"]}>
        <h1>Workouts page</h1>
        <Button
          buttonType="primary"
          buttonSize="medium"
          type="button"
          label="Create workout"
        />
      </div>
      <section className={styles["workouts__controls"]}>
        <div className={styles["workouts__controls-search"]}>
          <InputField
            type="text"
            name="search-client"
            label="Add workouts to client"
            id="search-client"
            placeholder="Client name"
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          />
        </div>
        <div className={styles["workouts__filter-controls"]}>
          <SelectField
            id="workout-filter"
            label=""
            name="workout-filter"
            options={WORKOUT_FILTER_OPTIONS}
          />
        </div>
      </section>
      <section className={styles["workouts__list"]}>
        {WORKOUTS.map((workout) => {
          return (
            <Card key={workout.id} variant="horizontal" size="medium">
              <CustomCheckbox
                className={styles["workouts__card-select"]}
                type="button"
                name="select-workout"
                onClick={handleClick}
                selected={isSelected}
              />
              <CardHeader>
                <h4>{workout.title}</h4>
                <p>Author: {workout.createdBy}</p>
              </CardHeader>
              <CardContent>
                <div className={styles["workouts__details"]}>
                  <p>Assigned: {workout.assignedClients}</p>
                  <p>Completed: {workout.completedTimes}</p>
                  <p>Exercises: {workout.exercises}</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className={styles["workouts__icons-container"]}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
