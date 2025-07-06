import { InputField } from "../inputField/InputField.jsx";
import styles from "./ClientAccountDetails.module.css";
import { RadioButton } from "../radioButton/RadioButton.jsx";
import { useOutletContext } from "react-router-dom";

export function ClientAccountDetails() {
  const { profile, setProfile } = useOutletContext();

  function handleUserFormChange(e) {
    setProfile((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <section className={styles["profile-page__settings-details"]}>
      <form action="" className={styles["profile-page__settings-form"]}>
        <div className={styles["form-group"]}>
          <InputField
            type="text"
            name="firstName"
            id="firstName"
            label="First name"
            value={profile.firstName}
            handleChange={handleUserFormChange}
          ></InputField>
        </div>
        <div className={styles["form-group"]}>
          <InputField
            type="text"
            name="lastName"
            id="lastName"
            label="Last name"
            value={profile.lastName}
            handleChange={handleUserFormChange}
          ></InputField>
        </div>
        <div className={styles["form-group"]}>
          <InputField
            type="email"
            name="email"
            id="email"
            label="E-Mail"
            value={profile.email ? profile.email : "Unknown"}
            handleChange={handleUserFormChange}
          ></InputField>
        </div>
        <div className={styles["form-group"]}>
          <InputField
            type="tel"
            name="phone"
            id="phone"
            label="Phone"
            value={profile.phone}
            handleChange={handleUserFormChange}
          ></InputField>
        </div>
        <div className={styles["form-group"]}>
          <p>Gender</p>

          <div className={styles["gender-radio-wrapper"]}>
            <RadioButton
              name="gender"
              id="male"
              checked={profile.gender === "male"}
              value="male"
              label="Male"
              handleChange={handleUserFormChange}
            />
            <RadioButton
              name="gender"
              id="female"
              checked={profile.gender === "female"}
              value="female"
              label="Female"
              handleChange={handleUserFormChange}
            />
          </div>
        </div>
      </form>
    </section>
  );
}
