import styles from "./ClientWorkouts.module.css";
import { Link, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export function ClientWorkouts() {
  const { profile, workoutTemplates, deleteWorkout } = useOutletContext();
  return (
    <div className={styles["client-workouts"]}>
      <h2>Assigned Workouts</h2>
      <ul className={styles["client-workouts__list"]}>
        {workoutTemplates.length > 0 ? (
          workoutTemplates.map((workouts) => {
            return (
              <li
                className={styles["client-workouts__list-item"]}
                key={workouts.id}
              >
                <div>
                  {" "}
                  <Link to={"/"}>View</Link>
                  <p>{workouts.name}</p>
                </div>
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => deleteWorkout(workouts.userWorkoutId)}
                />
              </li>
            );
          })
        ) : (
          <div>
            <p>
              No workouts to display.{" "}
              <Link
                to={"/workouts"}
              >{`Assign first workout to ${profile.firstName}`}</Link>
            </p>
          </div>
        )}
      </ul>
    </div>
  );
}
