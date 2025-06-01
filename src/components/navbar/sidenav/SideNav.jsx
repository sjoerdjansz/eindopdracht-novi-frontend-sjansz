import styles from "./SideNav.module.css";
import appLogo from "../../../assets/sweat-daddy-app-logo.svg";

import {
  faTableColumns,
  faBook,
  faDumbbell,
  faUser,
  faCalendarDay,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function SideNav() {
  return (
    <nav className={styles["side-nav"]}>
      <img src={appLogo} alt="sweat daddy app logo" />
      <ul className={styles["side-nav__nav-links"]}>
        <a href="/">
          <li className={styles["side-nav__link"]}>
            <span>
              <FontAwesomeIcon icon={faTableColumns} />
            </span>
            Dashboard
          </li>
        </a>
        <a href="/">
          <li className={styles["side-nav__link"]}>
            <span>
              <FontAwesomeIcon icon={faBook} />
            </span>
            Exercise Library
          </li>
        </a>
        <a href="/">
          <li className={styles["side-nav__link"]}>
            <span>
              <FontAwesomeIcon icon={faDumbbell} />
            </span>
            Workouts
          </li>
        </a>
        <a href="/">
          <li className={styles["side-nav__link"]}>
            <span>
              <FontAwesomeIcon icon={faUser} />
            </span>
            Clients
          </li>
        </a>
        <a href="/">
          <li className={styles["side-nav__link"]}>
            <span>
              <FontAwesomeIcon icon={faCalendarDay} />
            </span>
            Agenda
          </li>
        </a>
        <a href="/">
          <li className={styles["side-nav__link"]}>
            <span>
              <FontAwesomeIcon icon={faGear} />
            </span>
            Settings
          </li>
        </a>
      </ul>
    </nav>
  );
}
