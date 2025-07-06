import styles from "./CreateClientPage.module.css";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { Modal } from "../../components/modal/Modal.jsx";
import { useState } from "react";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";

export function CreateClientPage() {
  const [showSnackbar, setShowSnackbar] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setShowSnackbar(true);
  }

  return (
    <div className={styles["create-client"]}>
      {showSnackbar && (
        <Snackbar
          message="Client added succesfully"
          open={showSnackbar}
          status="success"
          durationVisible={3000}
          onClose={() => setShowSnackbar(false)}
        />
      )}
      <Modal title="Add Client" path="/clients">
        <div className={styles["create-client__modal"]}>
          <form action="">
            <div className={styles["create-client__form"]}>
              <div className={styles["form-group"]}>
                <InputField
                  label="First name"
                  name="firstName"
                  id="firstName"
                  required={true}
                  type="text"
                />
              </div>
              <div className={styles["form-group"]}>
                <InputField
                  label="Last name"
                  name="lastName"
                  id="lastName"
                  required={true}
                  type="text"
                />
              </div>
              <div className={styles["form-group"]}>
                <InputField
                  label="E-mail"
                  name="email"
                  id="email"
                  required={true}
                  type="email"
                />
              </div>
              <div className={styles["form-group"]}>
                <InputField
                  label="Phone"
                  name="phone"
                  id="phone"
                  type="number"
                />
              </div>
              <div className={styles["form-group"]}>
                <p>Gender</p>
                <div className={styles["gender-radio-wrapper"]}>
                  <label htmlFor="male" className={styles["gender-option"]}>
                    Male
                    <input type="radio" id="male" name="gender" value="male" />
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
            </div>
            <div className={styles["form-group"]}>
              <Button
                type="submit"
                label="Add Client"
                buttonSize="medium"
                buttonType="primary"
                handleClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
