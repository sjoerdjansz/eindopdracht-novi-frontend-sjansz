import styles from "./Modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export function Modal({ title, children, footerContent }) {
  return (
    <div className={styles["modal"]}>
      <div className={styles["modal__header"]}>
        <h3>{title}</h3>
        <span>
          <Link to={"/exercise-library"}>
            <FontAwesomeIcon icon={faXmark} />
          </Link>
        </span>
      </div>
      <div className={styles["modal__content--left"]}>{children}</div>
      <div className={styles["modal__content--right"]}></div>
      <div className={styles["modal__footer"]}>
        <p>{footerContent}</p>
      </div>
    </div>
  );
}
