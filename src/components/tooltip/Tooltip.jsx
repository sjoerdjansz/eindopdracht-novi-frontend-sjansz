import styles from "./Tooltip.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
export function Tooltip({ content }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleTooltip() {
    setIsOpen(!isOpen);
  }

  return (
    <div onClick={toggleTooltip} className={styles["tooltip-container"]}>
      <FontAwesomeIcon icon={faCircleInfo} />
      {isOpen && <p className={styles["tooltip-content"]}>{content}</p>}
    </div>
  );
}
