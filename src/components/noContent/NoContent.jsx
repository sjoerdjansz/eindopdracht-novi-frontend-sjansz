import styles from "./NoContent.module.css";
import { Button } from "../button/Button.jsx";

export function NoContent({
  title,
  message,
  handleClick,
  buttonLabel,
  children,
}) {
  return (
    <main className={styles["no-content"]}>
      <div className={styles["no-content__header-container"]}>
        <h1>{title}</h1>
        <p>{message}</p>
        <Button
          buttonType="primary"
          buttonSize="medium"
          type="button"
          label={buttonLabel}
          handleClick={handleClick}
        />
      </div>
      <div className={styles["no-content__content-container"]}>{children}</div>
    </main>
  );
}
