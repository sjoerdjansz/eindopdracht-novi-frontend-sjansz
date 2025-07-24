import styles from "./CreateClientPage.module.css";
import axios from "axios";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { Modal } from "../../components/modal/Modal.jsx";
import { useContext, useState } from "react";
import { InputField } from "../../components/inputField/InputField.jsx";
import { Button } from "../../components/button/Button.jsx";
import { RadioButton } from "../../components/radioButton/RadioButton.jsx";
import { API_ENDPOINTS } from "../../api/api.js";
import { AuthContext } from "../../context/AuthContextProvider.jsx";

export function CreateClientPage() {
  const { authUser } = useContext(AuthContext);
  const [showSnackbar, setShowSnackbar] = useState({
    message: "",
    open: false,
    status: "",
  });
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    joinedAt: "",
    imageUrl: null,
    completedWorkouts: 0,
    compliance: 0,
    currentPlan: "",
    userId: authUser.user.userId, // this is the trainer id that made the client (while logged in i.e.)
  });

  async function addNewClient() {
    if (!userDetails.firstName.trim() || !userDetails.lastName.trim()) {
      setShowSnackbar({
        message: `Make sure to fill in all fields`,
        open: true,
        status: "error",
      });
      return;
    }

    try {
      const { data } = await axios.get(
        `${API_ENDPOINTS.clients}?email=${userDetails.email}`,
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      if (
        data.length > 0 &&
        data[0].email.trim().toLowerCase() ===
          userDetails.email.trim().toLowerCase()
      ) {
        setShowSnackbar({
          open: true,
          message: "A user with this email already exists",
          status: "error",
        });
        return;
      }
      const response = await axios.post(
        `${API_ENDPOINTS.clients}`,
        {
          ...userDetails,
          firstName: userDetails.firstName.trim(),
          lastName: userDetails.lastName.trim(),
          phone: userDetails.phone.trim(),
          email: userDetails.email.trim(),
          gender: userDetails.gender,
        },
        {
          headers: {
            "novi-education-project-id": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );
      setShowSnackbar({
        message: `New client ${response.data.firstName} created`,
        open: true,
        status: "success",
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleUserDetailsChange(e) {
    setUserDetails((previous) => ({
      ...previous,
      joinedAt: new Date().toISOString(),
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addNewClient();
  }

  return (
    <div className={styles["create-client"]}>
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
      <Modal title="Add Client" path="/clients">
        <div className={styles["create-client__modal"]}>
          <form onSubmit={handleSubmit}>
            <div className={styles["create-client__form"]}>
              <div className={styles["form-group"]}>
                <InputField
                  label="First name"
                  name="firstName"
                  id="firstName"
                  required={true}
                  type="text"
                  value={userDetails.firstName}
                  handleChange={handleUserDetailsChange}
                />
              </div>
              <div className={styles["form-group"]}>
                <InputField
                  label="Last name"
                  name="lastName"
                  id="lastName"
                  required={true}
                  type="text"
                  value={userDetails.lastName}
                  handleChange={handleUserDetailsChange}
                />
              </div>
              <div className={styles["form-group"]}>
                <InputField
                  label="Email"
                  name="email"
                  id="email"
                  type="email"
                  value={userDetails.email}
                  handleChange={handleUserDetailsChange}
                  required={true}
                />
              </div>
              <div className={styles["form-group"]}>
                <InputField
                  label="Phone"
                  name="phone"
                  id="phone"
                  type="number"
                  value={userDetails.phone}
                  handleChange={handleUserDetailsChange}
                  required={true}
                />
              </div>
              <div className={styles["form-group"]}>
                <p>Gender</p>
                <div className={styles["gender-radio-wrapper"]}>
                  <RadioButton
                    name="gender"
                    id="male"
                    checked={userDetails.gender === "male"}
                    value="male"
                    label="Male"
                    handleChange={handleUserDetailsChange}
                  />
                  <RadioButton
                    name="gender"
                    id="female"
                    checked={userDetails.gender === "female"}
                    value="female"
                    label="Female"
                    handleChange={handleUserDetailsChange}
                  />
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
