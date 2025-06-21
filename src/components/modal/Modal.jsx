import styles from "./Modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

export function Modal({ title, children, footerContent }) {
  const navigate = useNavigate();

  function handleClose() {
    navigate(-1);
  }

  //   TODO: optimize component
  return (
    <div className={styles["modal"]}>
      <div className={styles["modal__header"]}>
        <div className={styles["header__title-wrapper"]}>
          <h3>{title}</h3>
        </div>
        <span
          onClick={() => {
            handleClose();
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
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
