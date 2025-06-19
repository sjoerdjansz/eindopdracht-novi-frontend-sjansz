import styles from "./TableRow.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faGripVertical } from "@fortawesome/free-solid-svg-icons";

export function TableRow({ handleDragOver, onDrop, onDragStart, exercise }) {
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
        <FontAwesomeIcon icon={faGripVertical} />
      </td>
      <td className={styles["td-name"]}>{exercise.name}</td>
      <td className={styles["td-sets"]}>{exercise.sets}</td>
      <td className={styles["td-reps"]}>{exercise.reps}</td>
      <td className={styles["td-rest"]}>{exercise.rest}</td>
      <td className={styles["td-controls"]}>
        <div>
          <span className={styles["td-controls__edit"]}>Edit</span>
          <div className={styles["td-controls__delete"]}>
            <FontAwesomeIcon icon={faBan} />
          </div>
        </div>
      </td>
    </tr>
  );
}
