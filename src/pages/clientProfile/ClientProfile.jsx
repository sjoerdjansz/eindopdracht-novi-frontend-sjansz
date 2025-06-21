import styles from "./ClientProfile.module.css";
import { Link, useParams } from "react-router-dom";

import { Card } from "../../components/card/Card.jsx";
import { Button } from "../../components/button/Button.jsx";

import { CLIENTS } from "../../data/clientData.js";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { useState } from "react";

export function ClientProfile() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { id } = useParams();

  const getUser = CLIENTS.find((client) => {
    const name = client.name.toLowerCase().split(" ");
    return name.includes(id.toLowerCase());
  });

  function handleSaveChanges() {
    setShowSnackbar(true);
  }

  return (
    <div className={styles["profile-page"]}>
      {showSnackbar && (
        <Snackbar
          message="Changes have been saved"
          open={showSnackbar}
          status="success"
          durationVisible={3500}
          onClose={() => setShowSnackbar(false)}
        />
      )}
      <h4>Profile</h4>
      <div className={styles["profile-page__container"]}>
        <Card>
          <div className={styles["profile-page__card-container"]}>
            <div className={styles["profile-page__card-header"]}>
              <div className={styles["profile-page__avatar-wrapper"]}>
                <img
                  className={styles["user-avatar"]}
                  src={getUser.avatar}
                  alt={`Profile picture of ${getUser.name}`}
                />
              </div>

              <div className={styles["profile-page__user-details"]}>
                <h4>{getUser.name}</h4>
                <p>35 | 186 | 86 kg</p>
              </div>
              <Button
                buttonType="success"
                label="Start Workout"
                type="button"
                buttonSize="medium"
              />
            </div>
            <div className={styles["profile-page__user-stats"]}>
              <p className={styles["statistic"]}>
                Workouts completed: <span>72</span>
              </p>
              <hr />
              <p className={styles["statistic"]}>
                Adherence score: <span>85</span>
              </p>
              <hr />
              <p className={styles["statistic"]}>
                Wellbeing score: <span>90</span>
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className={styles["profile-page__settings-card"]}>
            <nav className={styles["profile-page__settings-navigation"]}>
              <ul className={styles["profile-page__settings-links"]}>
                <li className={styles["profile-page__settings-link"]}>
                  <Link to={"/"}>Workouts</Link>
                </li>
                <li className={styles["profile-page__settings-link"]}>
                  <Link to={"/"}>Account</Link>
                </li>
                <li className={styles["profile-page__settings-link"]}>
                  <Link to={"/"}>Notifications</Link>
                </li>
              </ul>
            </nav>
            <section className={styles["profile-page__settings-details"]}>
              <form action="" className={styles["profile-page__settings-form"]}>
                <div className={styles["form-group"]}>
                  <InputField
                    type="text"
                    name="firstName"
                    id="firstName"
                    label="First name"
                  ></InputField>
                </div>
                <div className={styles["form-group"]}>
                  <InputField
                    type="text"
                    name="lastName"
                    id="lastName"
                    label="Last name"
                  ></InputField>
                </div>
                <div className={styles["form-group"]}>
                  <InputField
                    type="email"
                    name="email"
                    id="email"
                    label="E-Mail"
                  ></InputField>
                </div>
                <div className={styles["form-group"]}>
                  <InputField
                    type="tel"
                    name="phone"
                    id="phone"
                    label="Phone"
                  ></InputField>
                </div>
                <div className={styles["form-group"]}>
                  <p>Gender</p>
                  <div className={styles["gender-radio-wrapper"]}>
                    <label htmlFor="male" className={styles["gender-option"]}>
                      Male
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                      />
                    </label>

                    <label htmlFor="female" className={styles["gender-option"]}>
                      Female
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                      />
                    </label>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </Card>
      </div>

      <footer className={styles["profile-page__footer"]}>
        <Link to={""}>Delete account</Link>
        <Button
          buttonType="primary"
          buttonSize="large"
          type="button"
          label="Save Changes"
          handleClick={handleSaveChanges}
        />
      </footer>
    </div>
  );
}
