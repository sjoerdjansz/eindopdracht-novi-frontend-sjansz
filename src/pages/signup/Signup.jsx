import styles from "./Signup.module.css";

// Components
import { InputField } from "../../components/InputField/InputField.jsx";

export function Signup() {
  return (
    <main className={styles.signup}>
      <section className={styles["signup__image-container"]}></section>
      <section className={styles["signup__content-container"]}>
        <h1>Sweat Daddy</h1>
        <form className={styles["signup__content-form"]}>
          <p>Quick login</p>
          <button>Google</button>
          <hr />
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            value=""
            onChange=""
          />
          <InputField
            id="password"
            name="password"
            label="Password"
            type="password"
            value=""
            onChange=""
          />

          <a href="/">Forgot password?</a>

          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/">Login here</a>
        </p>
      </section>
    </main>
  );
}
