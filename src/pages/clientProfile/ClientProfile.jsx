import styles from "./ClientProfile.module.css";
import { Link, Route, useLocation, useParams } from "react-router-dom";
import axios from "axios";

import { Card } from "../../components/card/Card.jsx";
import { Button } from "../../components/button/Button.jsx";
import placeholderAvatar from "../../assets/no_profile_picture_image.jpeg";
import { LoadingSpinner } from "../../components/loadingSpinner/LoadingSpinner.jsx";

import { InputField } from "../../components/inputField/InputField.jsx";
import { Snackbar } from "../../components/snackbar/Snackbar.jsx";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../api/api.js";

export function ClientProfile() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    imageUrl: "",
    joinedAt: "",
    completedWorkouts: 0,
    compliance: 0,
    wellbeing: "",
  });
  const { id } = useParams();
  let location = useLocation();

  useEffect(() => {
    console.log(id);
    console.log(location);
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_ENDPOINTS.profiles}/${id}`, {
        headers: {
          "novi-education-project-id": import.meta.env.VITE_API_KEY,
        },
      });
      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // TODO: save function maken met patch/put naar db
  function handleSaveChanges() {
    setShowSnackbar(true);
  }

  return (
    <div className={styles["profile-page"]}>
      {isLoading && <LoadingSpinner />}
      {showSnackbar && (
        <Snackbar
          message="Changes have been saved"
          open={showSnackbar}
          status="success"
          durationVisible={3000}
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
                  src={profile.imageUrl ? profile.imageUrl : placeholderAvatar}
                  alt={`Profile picture of ${profile.firstName}`}
                />
              </div>

              <div className={styles["profile-page__user-details"]}>
                <h4>{`${profile.firstName} ${profile.lastName}`}</h4>
                <p>{`Joined: ${profile.joinedAt}`}</p>
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
                Workouts completed: <span>{profile.completedWorkouts}</span>
              </p>
              <hr />
              <p className={styles["statistic"]}>
                Compliance score: <span>{profile.compliance}%</span>
              </p>
              <hr />
              <p className={styles["statistic"]}>
                Wellbeing score:
                <span>{profile.wellbeing ? profile.wellbeing : "n/a"}</span>
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className={styles["profile-page__settings-card"]}>
            <nav className={styles["profile-page__settings-navigation"]}>
              <ul className={styles["profile-page__settings-links"]}>
                <li className={styles["profile-page__settings-link"]}>
                  <Link to={`/clients/${id}/workouts`}>Workouts</Link>
                </li>
                <li className={styles["profile-page__settings-link"]}>
                  <Link to={`/clients/${id}/account`}>Account</Link>
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
                    value={profile.firstName}
                    handleChange={(e) =>
                      setProfile({
                        ...profile,
                        firstName: e.target.value,
                      })
                    }
                  ></InputField>
                </div>
                <div className={styles["form-group"]}>
                  <InputField
                    type="text"
                    name="lastName"
                    id="lastName"
                    label="Last name"
                    value={profile.lastName}
                    handleChange={(e) =>
                      setProfile({
                        ...profile,
                        lastName: e.target.value,
                      })
                    }
                  ></InputField>
                </div>
                <div className={styles["form-group"]}>
                  <InputField
                    type="email"
                    name="email"
                    id="email"
                    label="E-Mail"
                    value={profile.email ? profile.email : "Unknown"}
                    handleChange={(e) =>
                      setProfile({
                        ...profile,
                        email: e.target.value,
                      })
                    }
                  ></InputField>
                </div>
                <div className={styles["form-group"]}>
                  <InputField
                    type="tel"
                    name="phone"
                    id="phone"
                    label="Phone"
                    value={`+31 ${profile.phone}`}
                    handleChange={(e) =>
                      setProfile({
                        ...profile,
                        phone: e.target.value,
                      })
                    }
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
                        checked={profile.gender === "male"}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            gender: e.target.value,
                          })
                        }
                      />
                    </label>

                    <label htmlFor="female" className={styles["gender-option"]}>
                      Female
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={profile.gender === "female"}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            gender: e.target.value,
                          })
                        }
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
