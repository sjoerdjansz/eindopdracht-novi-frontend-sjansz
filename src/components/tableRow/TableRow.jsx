import styles from "./TableRow.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripVertical,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export function TableRow({
  handleDragOver,
  onDrop,
  onDragStart,
  exercise,
  handleChange,
}) {
  return (
    <tr
      className={styles["draggable"]}
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      <td
        draggable={true}
        onDragStart={onDragStart}
        className={`${styles["table-align-center"]} ${styles["drag-icon"]}`}
      >
        <span>
          <FontAwesomeIcon icon={faGripVertical} />
        </span>
      </td>
      <td className={styles["td-name"]}>{exercise.name}</td>
      <td className={styles["td-sets"]}>
        <input
          className={styles["exercise-parameter-input"]}
          type="text"
          id="sets"
          name="sets"
          onChange={handleChange}
          value={exercise.sets}
        />
      </td>
      <td className={styles["td-reps"]}>
        <input
          className={styles["exercise-parameter-input"]}
          type="text"
          id="reps"
          name="reps"
          onChange={handleChange}
          value={exercise.reps}
        />
      </td>
      <td className={styles["td-rest"]}>
        <input
          className={styles["exercise-parameter-input"]}
          type="text"
          id="rest"
          name="rest"
          onChange={handleChange}
          value={exercise.rest}
        />
      </td>
      <td className={styles["td-controls"]}>
        <div>
          <div className={styles["table-row__icons"]}>
            <span>
              <FontAwesomeIcon icon={faPenToSquare} />
              <FontAwesomeIcon icon={faTrash} />
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}
