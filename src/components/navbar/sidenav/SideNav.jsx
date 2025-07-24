import styles from "./SideNav.module.css";
import appLogo from "../../../assets/Sweat-daddy-app-logo.svg";

import { NavLink } from "react-router-dom";

import {
  faCircleChevronRight,
  faCircleChevronLeft,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider.jsx";

// nav links
import { NAV_ITEMS } from "../../../data/navItems.js";

export function SideNav() {
  const [isSmallScreenSize, setIsSmallScreenSize] = useState(
    window.innerWidth < 768,
  );
  const [isNavCollapsed, setIsNavCollapsed] = useState(window.innerWidth < 768);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsSmallScreenSize(isMobile);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleNav = () => {
    setIsNavCollapsed((prev) => !prev);
  };

  return (
    <nav
      className={`${styles["side-nav"]} ${isNavCollapsed ? styles["collapsed"] : ""}`}
    >
      <div className={styles["side-nav__top-controls"]}>
        <div
          className={`${styles["logo-container"]} ${isNavCollapsed ? styles["collapsed"] : ""}`}
        >
          <img src={appLogo} alt="sweat daddy app logo" />
          <p>Sweat Daddy</p>
        </div>
        <span
          className={styles["nav-toggle__wrapper"]}
          onClick={handleToggleNav}
        >
          <FontAwesomeIcon
            icon={isNavCollapsed ? faCircleChevronRight : faCircleChevronLeft}
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
        onClick={() => {
          logout();
        }}
        to="/login"
        className={`${styles["side-nav__sign-out"]} ${isNavCollapsed ? styles["collapsed"] : ""}`}
      >
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        <span>Sign Out</span>
      </NavLink>
    </nav>
  );
}
