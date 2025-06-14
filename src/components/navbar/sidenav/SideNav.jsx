import styles from "./SideNav.module.css";
import appLogo from "../../../assets/sweat-daddy-app-logo.svg";

import { NavLink } from "react-router-dom";

import {
  faCircleChevronRight,
  faCircleChevronLeft,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

// nav links
import { NAV_ITEMS } from "../../../data/navItems.js";

export function SideNav() {
  const [toggleNav, setToggleNav] = useState(true);

  return (
    <nav
      className={`${styles["side-nav"]} ${toggleNav ? styles["collapsed"] : ""}`}
    >
      <div className={styles["side-nav__top-controls"]}>
        <div
          className={`${styles["logo-container"]} ${toggleNav ? styles["collapsed"] : ""}`}
        >
          <img src={appLogo} alt="sweat daddy app logo" />
          <p>Sweat Daddy</p>
        </div>
        <span
          className={styles["nav-toggle__wrapper"]}
          onClick={() => setToggleNav(!toggleNav)}
        >
          <FontAwesomeIcon
            icon={toggleNav ? faCircleChevronRight : faCircleChevronLeft}
            className={styles["nav-toggle"]}
          />
        </span>
        <ul className={styles["side-nav__nav-links"]}>
          {NAV_ITEMS.map((navItem) => {
            return (
              <NavLink to={navItem.to} key={navItem.id}>
                <li className={styles["side-nav__link"]}>
                  <span className={styles["link__icon"]}>
                    <FontAwesomeIcon icon={navItem.icon} />
                  </span>
                  <span className={styles["link__nav-label"]}>
                    {navItem.label}
                  </span>
                </li>
              </NavLink>
            );
          })}
        </ul>
      </div>
      <NavLink
        to="/signup"
        className={`${styles["side-nav__sign-out"]} ${toggleNav ? styles["collapsed"] : ""}`}
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        <span>Sign Out</span>
      </NavLink>
    </nav>
  );
}
