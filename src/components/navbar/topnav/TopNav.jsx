import styles from "./TopNav.module.css";

import noProfilePicture from "../../../assets/no_profile_picture_image.jpeg";

// Helpers
import { formatDate } from "../../../utils/formatDate.js";
import { faComment, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContextProvider.jsx";

export function TopNav() {
  const { authUser } = useContext(AuthContext);
  return (
    <nav className={styles["top-nav"]}>
      <p className={styles["top-nav__date"]}>{formatDate(new Date())}</p>
      <div className={styles["top-nav__controls"]}>
        {/*<FontAwesomeIcon icon={faComment} />*/}
        <FontAwesomeIcon icon={faBell} />
        <div className={styles["controls-user-details"]}>
          <p>{authUser.user.email}</p>
          <img src={noProfilePicture} alt="hank the tank profile picture" />
        </div>
      </div>
    </nav>
  );
}
