import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import styles from "./SmallCardDashContent.module.css";

export function SmallCardDashContent({
  icon,
  labelOne,
  labelTwo,
  labelOneNumber,
  labelTwoNumber,
  labelOnePercent,
  labelTwoPercent,
}) {
  return (
    <>
      <div className={styles["small-card__top-content"]}>
        <div className={styles["top-content__info"]}>
          <FontAwesomeIcon icon={icon} className={styles["info__icon"]} />
          <div>
            <p>
              {labelOne} <span>{labelOneNumber}</span>
            </p>
            <p>
              {labelTwo} <span>{labelTwoNumber}</span>
            </p>
          </div>
        </div>
        <div>
          <p>{labelOnePercent}</p>
          <p>{labelTwoPercent}</p>
        </div>
      </div>
      <div className={styles["small-card__bottom-content"]}>
        <Link to={"/"}>
          See details <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
    </>
  );
}
