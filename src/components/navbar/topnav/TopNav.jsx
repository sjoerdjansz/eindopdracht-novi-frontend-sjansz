import styles from "./TopNav.module.css";

import profilePicture from "../../../assets/hank-profile-picture.png";

// Helpers
import { formatDate } from "../../../utils/formatDate.js";
import { faComment, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function TopNav() {
  return (
    <nav className={styles["top-nav"]}>
      <p className={styles["top-nav__date"]}>{formatDate(new Date())}</p>
      <div className={styles["top-nav__controls"]}>
        <FontAwesomeIcon icon={faComment} />
        <FontAwesomeIcon icon={faBell} />
        <div className={styles["controls-user-details"]}>
          <p>Hank the Tank</p>
          <img src={profilePicture} alt="hank the tank profile picture" />
        </div>
      </div>
    </nav>
  );
}
