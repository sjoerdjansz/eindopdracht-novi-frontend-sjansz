import styles from "./Snackbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

export function Snackbar({ durationVisible, onClose, message, status, open }) {
  useEffect(() => {
    // Zorgt ervoor dat er geen timer wordt gezet als de open false is en ruimte de timer op als het
    // component opnieuw wordt gerenderd of unmounted wordt. Zonder die check start setTimeout alsnog
    // en dat is niet handig.
    if (!open) return;

    const snackTimer = setTimeout(() => {
      onClose();
    }, durationVisible);
    return () => clearTimeout(snackTimer);
  }, [open, durationVisible, onClose]);

  // returns null omdat we willen dat het onderstaande component en dus onderstaande return statement
  // met de jsx niet wordt gerenderd als de open state false is.
  if (!open) return null;

  return (
    <>
      {open && (
        <div
          className={`${styles["snackbar"]} ${styles[`snackbar--${status}`]}`}
        >
          <div className={styles["snackbar__content"]}>
            <p className={styles["snackbar__title"]}>{message}</p>
            <span
              onClick={() => {
                onClose();
              }}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </span>
          </div>
        </div>
      )}
    </>
  );
}
