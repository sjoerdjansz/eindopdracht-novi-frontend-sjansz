import styles from "./Login.module.css";
import { InputWrapper } from "../../components/inputWrapper/InputWrapper.jsx";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../context/AuthContextProvider.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";

export function Login() {
  const [showSnackbar, setShowSnackbar] = useState({
    open: false,
    message: "",
    status: "",
  });
  const [icon, setIcon] = useState(faEyeSlash);
  const [inputType, setInputType] = useState("password");
  const [userDetails, setUserDetails] = useState({
    email: "",
    loginPassword: "",
  });

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  function handleChange(e) {
    const { name, value } = e.target;

    setUserDetails((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(userDetails);

    if (result.success === false) {
      setShowSnackbar({
        open: true,
        message: result.errorMessage,
        status: "error",
      });
    } else if (result.success === true) {
      setShowSnackbar({
        open: true,
        message: "Logging in...",
        status: "success",
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
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
    <main className={styles["login-page"]}>
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
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <div className={styles["login-form__headers"]}>
          <h2>Sweat Daddy</h2>
          <h1>Trainer Login</h1>
        </div>
        <InputWrapper width="medium" direction="column">
          <InputField
            type="email"
            name="email"
            label="E-mail"
            id="email"
            placeholder="hello@email.com"
            value={userDetails.email}
            handleChange={handleChange}
          />
        </InputWrapper>
        <InputWrapper width="medium" direction="column">
          <InputField
            name="loginPassword"
            label="Password"
            id="password"
            type={inputType}
            placeholder="••••••••"
            toggleHandler={handleToggle}
            icon={<FontAwesomeIcon icon={icon} />}
            value={userDetails.password}
            handleChange={handleChange}
          />
        </InputWrapper>
        <Button label="login" buttonSize="small" buttonType="primary" />
        <Link to={""}>Forgot password?</Link>
      </form>
      <p>
        No account yet? <Link to={"/signup"}>Signup here</Link>
      </p>
    </main>
  );
}
