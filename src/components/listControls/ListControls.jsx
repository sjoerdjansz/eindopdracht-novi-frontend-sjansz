import styles from "./ListControls.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

export function ListControls({ title, value, isOpen, handleClick }) {
  return (
    <div className={styles["information-container__controls"]}>
      <div
        onClick={() => {
          handleClick(title);
        }}
        className={styles["controls__title"]}
      >
        {!isOpen ? (
          <FontAwesomeIcon icon={faCaretDown} />
        ) : (
          <FontAwesomeIcon icon={faCaretUp} />
        )}
        <p>{title}</p>
      </div>
      <span className={styles["controls__count"]}>{value}</span>
    </div>
  );
}
