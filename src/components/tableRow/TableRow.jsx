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
        <div className={styles["table-icon-wrapper"]}>
          <FontAwesomeIcon icon={faGripVertical} />
        </div>
      </td>
      <td className={styles["table-align-left"]}>{exercise.name}</td>
      <td className={styles["table-align-center"]}>{exercise.sets}</td>
      <td className={styles["table-align-center"]}>{exercise.reps}</td>
      <td className={styles["table-align-center"]}>{exercise.rest}</td>
      <td className={styles["table-align-center"]}>
        <div className={styles["table-controls"]}>
          <span className={styles["table-controls__edit"]}>Edit</span>
          <span className={styles["table-controls__superset"]}>Superset</span>
          <div className={styles["table-controls__delete"]}>
            <div className={styles["table-icon-wrapper"]}>
              <FontAwesomeIcon icon={faBan} />
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
