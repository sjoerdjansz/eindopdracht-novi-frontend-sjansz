import styles from "./Signup.module.css";

// Font Awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

// Components
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";
import { API_ENDPOINTS } from "../../api/api.js";
import axios from "axios";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { passwordValidation } from "../../utils/passwordValidation.js";
import { Tooltip } from "../../components/tooltip/Tooltip.jsx";

export function Signup() {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    roles: ["trainer"],
  });
  // Password icon state - kan ook met één state, maar voor later
  const [icon, setIcon] = useState(faEyeSlash);
  const [inputType, setInputType] = useState("password");
  // Utility states
  const [isPasswordValid, setIsPasswordValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });

  async function registerNewUser(user) {
    if (!user.email || !user.password || !user.email.includes("@")) {
      setShowSnackbar({
        message: `Make sure you add (a valid) email and password`,
        open: true,
        status: "error",
      });
      return;
    }

    try {
      setIsLoading(true);

      const existingUsers = await axios.get(API_ENDPOINTS.users, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });

      const matchedUser = existingUsers.data.find((u) => {
        return u.email === user.email;
      });

      if (matchedUser) {
        setShowSnackbar({
          message: `A user with the email '${matchedUser.email}' already exists`,
          open: true,
          status: "error",
        });
        return;
      }

      await axios.post(API_ENDPOINTS.users, user, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
          "Content-Type": "application/json",
        },
      });

      setShowSnackbar({
        message: "Your account has been created",
        open: true,
        status: "success",
      });
    } catch (error) {
      setShowSnackbar({
        message: "Something went wrong while creating your account",
        open: true,
        status: "error",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e) {
    let value = e.target.value;
    let name = e.target.name;

    if (name === "password") {
      setIsPasswordValid(passwordValidation(value));
    }
    setUserDetails((previous) => {
      return { ...previous, [name]: value };
    });
  }

  function handleSubmit(e, user) {
    e.preventDefault();
    registerNewUser(user);
    setIsPasswordValid(null);
    setUserDetails((prevState) => ({
      ...prevState,
      email: "",
      password: "",
      roles: ["trainer"],
    }));
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
      {isLoading && <LoadingSpinner />}
      {showSnackbar && (
        <Snackbar
          message={showSnackbar.message}
          open={showSnackbar.open}
          status={showSnackbar.status}
          durationVisible={3000}
          onClose={() =>
            setShowSnackbar({
              ...showSnackbar,
              open: false,
            })
          }
        />
      )}
      <section className={styles["signup__image-container"]}></section>
      <section className={styles["signup__content-container"]}>
        <h1>Sweat Daddy</h1>
        <form
          onSubmit={(e) => handleSubmit(e, userDetails)}
          className={styles["signup__content-form"]}
        >
          <p>Quick login</p>
          <Button
            label="Google"
            type="button"
            buttonSize="medium"
            buttonType="secondary"
            disabled={true}
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
            togglePasswordValidation={isPasswordValid}
            tooltip={
              <Tooltip content="Password must include an uppercase letter, lowercase letter, number and special character." />
            }
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
          Already have an account? <a href="/login">Login here</a>
        </p>
      </section>
    </main>
  );
}
