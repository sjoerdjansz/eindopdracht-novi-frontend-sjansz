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
  handleDelete,
}) {
  return (
    <tr
      className={styles["draggable"]}
      onDragOver={handleDragOver}
      onDrop={onDrop}
      draggable={true}
      onDragStart={onDragStart}
    >
      <td className={`${styles["table-align-center"]} ${styles["drag-icon"]}`}>
        <span className={styles["drag-icon__inner"]}>
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
          onChange={(e) => handleChange(e, exercise.id)}
          value={exercise.sets}
        />
      </td>
      <td className={styles["td-reps"]}>
        <input
          className={styles["exercise-parameter-input"]}
          type="text"
          id="reps"
          name="reps"
          onChange={(e) => handleChange(e, exercise.id)}
          value={exercise.reps}
        />
      </td>
      <td className={styles["td-rest"]}>
        <input
          className={styles["exercise-parameter-input"]}
          type="text"
          id="rest"
          name="rest"
          onChange={(e) => handleChange(e, exercise.id)}
          value={exercise.rest}
        />
      </td>
      <td className={styles["td-controls"]}>
        <div>
          <div className={styles["table-row__icons"]}>
            <span>
              <FontAwesomeIcon icon={faTrash} onClick={handleDelete} />
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}
