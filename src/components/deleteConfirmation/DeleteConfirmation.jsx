import styles from "./DeleteConfirmation.module.css";

export function DeleteConfirmation({ title, item, onDelete, onCancel }) {
  return (
    <div className={styles["delete-confirmation"]}>
      <div className={styles["content-container"]}>
        <p>{title}</p>
        <p>'{item}'</p>
      </div>
      <div className={styles["button-container"]}>
        <button type="button" onClick={(e) => onDelete(e)}>
          Delete
        </button>
        <button type="button" onClick={(e) => onCancel(e)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
