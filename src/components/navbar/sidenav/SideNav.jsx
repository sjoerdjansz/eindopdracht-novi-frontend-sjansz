import styles from "./SideNav.module.css";
import appLogo from "../../../assets/sweat-daddy-app-logo.svg";

import { NavLink } from "react-router-dom";

import {
  faTableColumns,
  faBook,
  faDumbbell,
  faUser,
  faCalendarDay,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function SideNav() {
  return (
    <nav className={styles["side-nav"]}>
      <div className="side-nav__top-controls">
        <div className={styles["logo-container"]}>
          <img src={appLogo} alt="sweat daddy app logo" />
          <p>Sweat Daddy</p>
        </div>
        <ul className={styles["side-nav__nav-links"]}>
          <NavLink to="/dashboard">
            <li className={styles["side-nav__link"]}>
              <span>
                <FontAwesomeIcon icon={faTableColumns} />
              </span>
              Dashboard
            </li>
          </NavLink>
          <NavLink to="/exercise-library">
            <li className={styles["side-nav__link"]}>
              <span>
                <FontAwesomeIcon icon={faBook} />
              </span>
              Exercise Library
            </li>
          </NavLink>
          <NavLink to="/workouts">
            <li className={styles["side-nav__link"]}>
              <span>
                <FontAwesomeIcon icon={faDumbbell} />
              </span>
              Workouts
            </li>
          </NavLink>
          <NavLink to="/workout-builder">
            <li className={styles["side-nav__link"]}>
              <span>
                <FontAwesomeIcon icon={faPuzzlePiece} />
              </span>
              Build Workout
            </li>
          </NavLink>
          <NavLink to="/clients">
            <li className={styles["side-nav__link"]}>
              <span>
                <FontAwesomeIcon icon={faUser} />
              </span>
              Clients
            </li>
          </NavLink>
          <NavLink to="/agenda">
            <li className={styles["side-nav__link"]}>
              <span>
                <FontAwesomeIcon icon={faCalendarDay} />
              </span>
              Agenda
            </li>
          </NavLink>
        </ul>
      </div>
      <NavLink to="/signup">Sign Out</NavLink>
    </nav>
  );
}
