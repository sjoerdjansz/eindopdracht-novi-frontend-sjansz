import styles from "./TrackExerciseCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faHistory,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Card } from "../card/Card.jsx";
import { ExerciseResultRow } from "../exerciseResultRow/ExerciseResultRow.jsx";
import { useState } from "react";

export function TrackExerciseCard({ exerciseName, setCount }) {
  const [toggleExerciseCard, setToggleExerciseCard] = useState(true);

  return (
    <article className={styles["track-exercise-card"]}>
      <div className={styles["track-exercise-card__title"]}>
        <div>
          <h3>{exerciseName}</h3>
          <FontAwesomeIcon icon={faHistory} />
        </div>
        <Link to="">Delete</Link>
      </div>
      <Card size="medium" variant="vertical">
        <div className={styles["track-exercise-card__content-container"]}>
          <div className={styles["track-exercise-card__header-row"]}>
            <div className={styles["exercise-card__camera"]}>
              <FontAwesomeIcon icon={faVideoCamera} />
            </div>
            <div></div>
            {<div>Reps</div>}
            <div></div>
            <div>Weight</div>
            <div
              className={styles["exercise-card__caret"]}
              onClick={() => {
                setToggleExerciseCard(!toggleExerciseCard);
              }}
            >
              <FontAwesomeIcon
                icon={toggleExerciseCard ? faCaretDown : faCaretUp}
              />
            </div>
          </div>
          <div
            className={`${styles["track-exercise-card__result-rows-container"]} ${toggleExerciseCard && styles["open-card"]}`}
          >
            {Array.from({ length: setCount }).map((val, index) => {
              return <ExerciseResultRow key={index} index={index} />;
            })}
          </div>
        </div>
      </Card>
    </article>
  );
}
