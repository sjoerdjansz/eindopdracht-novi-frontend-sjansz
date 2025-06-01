import styles from "./Signup.module.css";

// Font Awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

// Components
import { InputField } from "../../components/InputField/InputField.jsx";
import { Button } from "../../components/Button/Button.jsx";

export function Signup() {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  // password icon state - kan ook met één state, maar voor later
  const [icon, setIcon] = useState(faEyeSlash);
  const [inputType, setInputType] = useState("password");

  function handleChange(e) {
    let value = e.target.value;
    let name = e.target.name;

    setUserDetails((previous) => {
      return { ...previous, [name]: value };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(userDetails);
    setUserDetails({ email: "", password: "" });
  }

  // password icon toggle
  function handleToggle() {
    if (inputType === "password") {
      setIcon(faEye);
      setInputType("text");
    } else {
      setIcon(faEyeSlash);
      setInputType("password");
    }
  }

  return (
    <main className={styles.signup}>
      <section className={styles["signup__image-container"]}></section>
      <section className={styles["signup__content-container"]}>
        <h1>Sweat Daddy</h1>
        <form
          onSubmit={handleSubmit}
          className={styles["signup__content-form"]}
        >
          <p>Quick login</p>
          <Button
            label="Google"
            type="button"
            buttonSize="medium"
            buttonType="secondary"
          />
          <hr />
          <InputField
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="hello@email.com"
            value={userDetails.email}
            handleChange={handleChange}
          />
          <InputField
            id="password"
            name="password"
            label="Password"
            type={inputType}
            value={userDetails.password}
            handleChange={handleChange}
            icon={<FontAwesomeIcon icon={icon} />}
            toggleHandler={handleToggle}
          />
          <a href="/">Forgot password?</a>
          <Button
            label="Sign Up"
            type="submit"
            buttonSize="medium"
            buttonType="primary"
          />
        </form>
        <p>
          Already have an account? <a href="/">Login here</a>
        </p>
      </section>
    </main>
  );
}
